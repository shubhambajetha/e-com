const prisma = require("../config/prismaClient");

async function getAllProducts(req, res, next) {
  try {
    const { skip = 0, take = 10 } = req.query;
    
    const products = await prisma.product.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        categories: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    const total = await prisma.product.count();

    res.status(200).json({
      success: true,
      data: products.map((product) => ({
        ...product,
        avgRating: product.reviews.length > 0
          ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
          : null,
        reviewCount: product.reviews.length,
      })),
      total,
      skip: parseInt(skip),
      take: parseInt(take),
    });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const avgRating = product.reviews.length > 0
      ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
      : null;

    res.status(200).json({
      success: true,
      data: {
        ...product,
        avgRating,
        reviewCount: product.reviews.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, description, price, image, stock, categoryIds } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        stock: parseInt(stock) || 0,
        categories: {
          connect: (categoryIds || []).map((id) => ({ id })),
        },
      },
      include: {
        categories: true,
      },
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
};

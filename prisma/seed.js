// prisma/seed.js
const { PrismaClient } = require("@prisma/client");

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}

prisma = global.prisma;

async function main() {
  // First, check if we already have a hero banner
  const existingBanner = await prisma.heroBanner.findFirst();

  if (!existingBanner) {
    // Create initial hero banner only if none exists
    const banner = await prisma.heroBanner.create({
      data: {
        title: "Elevate Your Style Beyond Ordinary",
        subtitle: "Discover the Future of Fashion",
        description:
          "Experience fashion reimagined with our curated collection of cutting-edge designs and timeless classics.",
        primaryButtonText: "Explore Collection",
        primaryButtonLink: "/products",
        secondaryButtonText: "View Lookbook",
        secondaryButtonLink: "/products",
        images: [
          "https://res.cloudinary.com/drrlgn5mf/image/upload/v1736686629/store-categories/ocogvpa6vqccs7ddei0d.jpg",
          "https://res.cloudinary.com/drrlgn5mf/image/upload/v1736686629/store-categories/sffecaelnbfb3so3gk40.jpg",
          "https://res.cloudinary.com/drrlgn5mf/image/upload/v1736686629/store-categories/x1xu3oolagls0brvdvzc.jpg",
          "https://res.cloudinary.com/drrlgn5mf/image/upload/v1736686629/store-categories/uwzydn6nuqlk3u67n6fo.jpg",
        ],
        isActive: true,
      },
    });

    console.log("Created initial hero banner:", banner);
  } else {
    console.log("Hero banner already exists, skipping seed");
  }
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

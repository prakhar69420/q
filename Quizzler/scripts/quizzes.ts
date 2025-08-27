const { PrismaClient } = require("@prisma/client");

let quizzesPrisma: any;

const quizzes = [
  {
    title: "Computer Science Basics",
    description: "A quiz about fundamental computer science concepts.",
    categoryId: "689f8882fa84610e3415705c", // Replace with the actual category ID
  },
  {
    title: "Programming Fundamentals",
    description: "Test your knowledge of basic programming concepts.",
    categoryId: "689f8882fa84610e3415705b",
  },
  {
    title: "Data Structures",
    description: "Assess your understanding of data structures.",
    categoryId: "689f8882fa84610e3415705c",
  },
  {
    title: "Physics",
    description: "Test your knowledge of physics",
    categoryId: "689f8883fa84610e34157061",
  },
  {
    title: "Biology",
    description: "Test your knowledge of Biology",
    categoryId: "689f8883fa84610e34157062",
  },
  {
    title: "Chemistry",
    description: "Test your knowledge of Chemistry",
    categoryId: "689f8881fa84610e34157059",
  },
];

async function seedQuizzes() {
  quizzesPrisma = new PrismaClient();

  console.log("Seeding quizzes...");

  for (const quiz of quizzes) {
    const craetedQuiz = await quizzesPrisma.quiz.create({
      data: quiz,
    });

    console.log("Created quiz: ", `${craetedQuiz.title}`);
  }

  console.log("Seeding quizzes completed.");
}

seedQuizzes()
  .catch((e) => {
    console.log("Error seeding quizzes: ", e);
  })
  .finally(async () => {
    await quizzesPrisma.$disconnect();
  });

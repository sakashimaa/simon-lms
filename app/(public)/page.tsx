import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
}

const features: FeatureProps[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Learn from a wide range of courses, from programming to design to business.",
    icon: "📚",
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with our interactive platform, where you can learn through videos, quizzes, and more.",
    icon: "🎮",
  },
  {
    title: "Progress Tracking",
    description: "Monitor your progress with our progress tracking system.",
    icon: "📊",
  },
  {
    title: "Community Support",
    description:
      "Join a community of learners and get support from our experts.",
    icon: "👥",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">The Future of Online Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate Your Learning Experience
          </h1>
          <p className="text-muted-foreground max-w-[700px] md:text-xl">
            Discover a new way to learn with our modern, interactive platform.
            Access high-quality courses anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/courses" className={buttonVariants({ size: "lg" })}>
              Explore Courses
            </Link>

            <Link
              href="/login"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}

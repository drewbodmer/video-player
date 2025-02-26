import { ModeToggle } from "@/components/DarkMode";

interface HeaderProps {
  userId: string;
}

export const Header = ({ userId }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-3xl font-bold text-primary">Educational Video Player</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">User ID: {userId}</span>
        <ModeToggle />
      </div>
    </div>
  );
};
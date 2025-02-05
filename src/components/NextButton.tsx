import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";

interface NextButtonInterface {
  type: "button" | "submit" | "reset";
  colorScheme:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "badge"
    | "flat";
  loading: boolean;
  disabled: boolean;
  isIcon: boolean;
  className: string;
  children: React.ReactNode;
  href: string | undefined;
  rest: any;
}

const getColorSchemeClass = (
  colorScheme: NextButtonInterface["colorScheme"],
) => {
  switch (colorScheme) {
    case "primary":
      return "border-indigo-100 border bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-800";
    case "secondary":
      return "border border-zinc-900 bg-black hover:bg-zinc-700 active:bg-zinc-900";
    case "success":
      return "border border-green-100 bg-green-600 hover:bg-green-500 active:bg-green-800";
    case "warning":
      return "border border-yellow-100 bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-800";
    case "error":
      return "border border-red-100 bg-red-600 hover:bg-red-500 active:bg-red-800";
    case "badge":
      return "rounded-lg py-2 bg-zinc-950 text-white h-auto shadow-none border-none";
    case "flat":
      return "text-black bg-transparent border-none shadow-none hover:bg-zinc-100 active:bg-zinc-200";
    default:
      return "border border-zinc-100 text-black bg-transparent hover:bg-zinc-100 active:bg-zinc-200";
  }
};

const NextButton = forwardRef(
  (
    {
      type,
      colorScheme,
      loading,
      disabled,
      isIcon,
      className,
      children,
      href,
      ...rest
    }: NextButtonInterface,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const router = useRouter();
    const variant = colorScheme === "primary" ? "solid" : "bordered";
    const colorSchemeClass = getColorSchemeClass(colorScheme);

    return (
      <Button
        ref={ref}
        type={type}
        onClick={(e) => {
          if (disabled || loading) {
            e.preventDefault();
            return;
          }
          if (href) {
            router.push(href);
          }
        }}
        variant={variant}
        radius="sm"
        className={cn(
          "text-xs font-medium text-white shadow-small active:scale-95",
          colorSchemeClass,
          isIcon && "min-w-0 rounded-3xl px-3 py-2",
          className,
        )}
        isDisabled={disabled || loading}
        {...rest}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      </Button>
    );
  },
);

NextButton.displayName = "NextButton";

export default NextButton;

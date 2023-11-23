import { UploadCloud } from "lucide-react";
import Image from "next/image";

export function ImageInput({
  image,
  setImage,
  name,
}: {
  image: string | null;
  setImage: (val: string | null) => void;
  name: string;
}) {
  function onFileDrop(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("changing");
    e.preventDefault();
    const [file] = e.target.files ?? [];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="relative h-32 rounded-md border border-stone-600">
        <div className="absolute inset-0">
          <Image
            src={
              image ??
              "http://localhost:4200/api/images/portfolio_thumbnail.png"
            }
            fill
            objectFit="cover"
            alt="New background image of the meeting"
            className="rounded-md"
          />
        </div>
        <label
          htmlFor={name}
          className="drop group absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-md opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-stone-950/30 hover:opacity-100"
        >
          <div className="flex flex-col items-center gap-2 text-sm">
            <UploadCloud className="h-6 w-6" />
            Upload new background image
          </div>
          <input
            id={name}
            name={name}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileDrop}
          />
        </label>
      </div>
    </div>
  );
}

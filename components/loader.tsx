import Image from "next/image";

const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-24 h-20 relative">
        <Image alt="logo" fill src="/loading.gif" />
      </div>
      <p className="text-sm text-muted-foreground">Professio is thinking...</p>
    </div>
  );
};

export default Loader;

interface FreeCounterProps {
  apiLimitCount: number;
}

const FreeCounter = ({ apiLimitCount = 0 }: FreeCounterProps) => {
  return <div>FreeCounter</div>;
};

export default FreeCounter;

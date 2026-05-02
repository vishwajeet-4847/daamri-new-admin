import { useRef } from "react";

const OtpInput = ({ value = "", onChange }: { value: string; onChange: (v: string) => void }) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  return (
    <div className="flex gap-3">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => {
            const ch = e.target.value.replace(/\D/g, "").slice(-1);
            const next = [...digits];
            next[i] = ch;
            onChange(next.join(""));
          }}
          style={{
            width: 44,
            height: 52,
            textAlign: "center",
            fontSize: 20,
            fontWeight: 700,
            borderRadius: 12,
            border: "2px solid #cbd5e1",
          }}
        />
      ))}
    </div>
  );
};

export default OtpInput;

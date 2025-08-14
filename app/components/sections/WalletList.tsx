"use client";

import { useEffect, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function WalletList() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wallets");
      const data = await res.json();
      setWallets(data);
    } catch (err) {
      console.error("Error fetching wallets:", err);
      alert("Failed to fetch wallets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <div className="space-y-4">
      {loading && <p>Loading wallets...</p>}

      {wallets.map((w) => (
        <Card key={w.id} className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">{w.asset.name} ({w.asset.symbol})</h4>
            <p>Total: {w.totalBalance}</p>
            <p>Available: {w.availableBalance}</p>
          </div>
          <div className="flex flex-col gap-2">
            {w.depositAddresses.map((addr: any) => (
              <div key={addr.address} className="flex gap-2 items-center">
                <span className="text-sm font-mono">{addr.address}</span>
                <Button onClick={() => navigator.clipboard.writeText(addr.address)}>
                  Copy
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

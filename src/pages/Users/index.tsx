import { useState, useEffect } from "react";
import { useGetUsers, useToggleUserStatus } from "@/src/services/api";
import { User } from "@/src/types";
import { Search, ChevronLeft, ChevronRight, Users as UsersIcon } from "lucide-react";

const AVATAR_COLORS = ["#6366f1","#f59e0b","#10b981","#ec4899","#38bdf8","#a78bfa"];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function Users() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: usersResponse, isLoading } = useGetUsers({ page, limit, search });
  const { mutateAsync: toggleStatus } = useToggleUserStatus();

  // Reset to first page when searching to avoid empty results on deep pages
  useEffect(() => {
    setPage(1);
  }, [search]);

  const users = usersResponse?.data ?? [];
  const pagination = usersResponse?.pagination;

  const handleToggle = async (user: User) => {
    try {
      await toggleStatus(user._id || (user as any).id);
    } catch(error) {
      console.log(error);
    }
  };

  const typeClass: Record<string, string> = {
    seller: "bg-purple-50 text-purple-700 border-purple-100",
    service_provider: "bg-sky-50 text-sky-700 border-sky-100",
    other: "bg-slate-50 text-slate-600 border-slate-100",
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h2>
          <p className="text-slate-500 font-medium mt-1">Manage system access, roles, and account statuses.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
          <UsersIcon className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-bold text-indigo-700">
            {pagination?.total ?? 0} Total Users
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Search Toolbar */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Search by name, email or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                {["User Details", "Contact", "Location", "User Type", "Joined Date", "Status"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500 text-sm italic">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user: User, i: number) => {
                  const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  const userType = (user as any).profile?.userType ?? "other";
                  return (
                    <tr key={user._id || (user as any).id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm"
                            style={{ background: `${color}22`, color }}
                          >
                            {initials(user.name || "User")}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-xs text-slate-600">{(user as any).phone || "—"}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">{(user as any).profile?.city || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${typeClass[userType] ?? typeClass.other}`}>
                          {userType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                        {formatDate((user as any).createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggle(user)}
                            className={`relative w-10 h-5.5 rounded-full cursor-pointer transition-all duration-300 outline-none border-2 ${
                              user.isActive 
                                ? "bg-indigo-600 border-indigo-600" 
                                : "bg-slate-200 border-slate-200"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                                user.isActive ? "left-[18px]" : "left-0.5"
                              }`}
                            />
                          </button>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${user.isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-bold text-slate-900">
              {Math.min(page * limit, pagination.total)}
            </span>{" "}
            of <span className="font-bold text-slate-900">{pagination.total}</span> users
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                    page === i + 1 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
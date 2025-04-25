"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  User,
  Folder,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";
import useAuthStore from "@/store/auth-store";
import { authApi } from "@/lib/api";

const links = [
  { href: "/dashboard", label: "Accueil", icon: <Home size={18} /> },
  { href: "/dashboard/profil", label: "Profil", icon: <User size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const router = useRouter();
  const [openProjects, setOpenProjects] = useState(false);
  const [projects, setProjects] = useState([]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await authApi.get("/projects/me"); // à adapter à ton backend
        setProjects(res.data);
      } catch (error) {
        console.error("Erreur chargement projets", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <aside className="bg-gray-900 text-white w-64 hidden md:flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8">Mon Dashboard</h1>
      <nav className="flex flex-col gap-2 flex-1">
        {links.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all
        ${
          pathname === href
            ? "bg-gray-700 text-white font-semibold"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }
      `}
          >
            <span className="text-white">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}

        {/* Projets (accordion) */}
        <button
          onClick={() => setOpenProjects(!openProjects)}
          className="flex items-center justify-between px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition"
        >
          <span className="flex items-center gap-3">
            <Folder size={18} />
            <span>Projets</span>
          </span>
          {openProjects ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        {openProjects && (
          <div className="ml-8 mt-1 flex flex-col gap-2 transition-all">
            {projects.length === 0 && (
              <span className="text-sm text-gray-400">Aucun projet</span>
            )}
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className={`text-sm px-3 py-1 rounded-md transition 
            ${
              pathname === `/dashboard/projects/${p.id}`
                ? "bg-gray-700 text-white font-semibold"
                : "text-gray-300 hover:bg-gray-800"
            }
          `}
              >
                {p.titre}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="text-sm text-gray-400 mt-6 px-4">
        {user && <p>{user.email}</p>}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 py-2 px-4 rounded text-white font-semibold"
      >
        <LogOut size={16} />
        Déconnexion
      </button>
    </aside>
  );
}

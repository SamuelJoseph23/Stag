import { Link, useLocation } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
};

export default function Sidebar({ isOpen }: SidebarProps) {
	const { pathname } = useLocation();

	const link = `flex items-center gap-3 p-3 rounded text-White ${
		isOpen ? "" : "hover:bg-gray-600"
	}`;

	const active = `${isOpen ? "w-0 opacity-0" : "w-auto opacity-100"} bg-gray-600 font-semibold text-green-300`;

	return (
		<div className={`h-full text-white bg-gray-900 transition-all duration-300 flex flex-col ${isOpen ? "w-0 h-0" : "w-36 h-16"}`}>
			<nav className="flex flex-col gap-1">
				<Link className={`${link} ${pathname === "/dashboard" && active} ${isOpen ? "pointer-events-none" : ""}`} to="/dashboard">
					<span className={`flex items-center gap-2 overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 -960 960 960">
							<path d="M640-160v-280h160v280zm-240 0v-640h160v640zm-240 0v-440h160v440z" />
						</svg>
						<span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
							Dashboard
						</span>
					</span>
				</Link>

				<Link className={`${link} ${pathname === "/current" && active} ${isOpen ? "pointer-events-none" : ""}`} to="/current">
					<span className={`flex items-center gap-2 overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 -960 960 960">
							<path d="M200-280v-280h80v280zm240 0v-280h80v280zM80-120v-80h800v80zm600-160v-280h80v280zM80-640v-80l400-200 400 200v80zm178-80h444zm0 0h444L480-830z" />
						</svg>
						<span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
							Current
						</span>
					</span>
				</Link>

				<Link className={`${link} ${pathname === "/future" && active} ${isOpen ? "pointer-events-none" : ""}`} to="/future">
					<span className={`flex items-center gap-2 overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 -960 960 960">
							<path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480z" />
						</svg>
						<span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
							Future
						</span>
					</span>
				</Link>
			</nav>
		</div>
	);
}

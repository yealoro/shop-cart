"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign,
  Eye,
  Plus,
  ArrowUpRight,
  Calendar,
  Bell
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch products count
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const products = productsResponse.ok ? await productsResponse.json() : [];
        
        // Fetch categories count
        const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const categories = categoriesResponse.ok ? await categoriesResponse.json() : [];
        
        // Mock data for orders and revenue (replace with real API calls)
        const mockOrders = [
          { id: 1, customer: "Juan Pérez", total: 89.99, status: "Completado", date: "2024-01-15" },
          { id: 2, customer: "María García", total: 156.50, status: "Pendiente", date: "2024-01-14" },
          { id: 3, customer: "Carlos López", total: 234.75, status: "Enviado", date: "2024-01-13" },
        ];
        
        // Filter low stock products (assuming stock < 10 is low)
        const lowStock = products.filter((product: any) => product.stock && product.stock < 10);
        
        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalOrders: mockOrders.length,
          totalRevenue: mockOrders.reduce((sum: number, order: any) => sum + order.total, 0),
          recentOrders: mockOrders,
          lowStockProducts: lowStock.slice(0, 5) // Show only first 5
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground">Cargando dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Badge variant="secondary">
              <Calendar className="mr-1 h-3 w-3" />
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Ver Tienda
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">¡Bienvenido a Deco House Dashboard!</h2>
          <p className="text-blue-100 mb-4">Gestiona tu tienda online de manera eficiente</p>
          <div className="flex gap-3">
            <Link href="/products/create">
              <Button variant="secondary" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </Link>
            <Link href="/categories/create">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Categoría
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/products" className="text-blue-600 hover:underline flex items-center">
                  Ver todos <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorías</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/categories" className="text-blue-600 hover:underline flex items-center">
                  Gestionar <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde ayer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline mr-1 h-3 w-3 text-green-500" />
                +12% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recientes</CardTitle>
              <CardDescription>Los últimos pedidos realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.total}</p>
                        <Badge 
                          variant={order.status === 'Completado' ? 'default' : 
                                  order.status === 'Pendiente' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No hay pedidos recientes</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle>Productos con Stock Bajo</CardTitle>
              <CardDescription>Productos que necesitan reabastecimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.lowStockProducts.length > 0 ? (
                  stats.lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg border-orange-200 bg-orange-50">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="text-xs">
                          Stock: {product.stock || 0}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Package className="mx-auto h-8 w-8 text-green-500 mb-2" />
                    <p className="text-muted-foreground">Todos los productos tienen stock suficiente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Accesos directos a las funciones más utilizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/products">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Package className="h-6 w-6" />
                  <span className="text-sm">Ver Productos</span>
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Categorías</span>
                </Button>
              </Link>
              <Link href="/products/create">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">Nuevo Producto</span>
                </Button>
              </Link>
              <Link href="/categories/create">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">Nueva Categoría</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
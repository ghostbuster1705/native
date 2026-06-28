import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CARD_W = (SCREEN_W - 48) / 2;
const HERO_H = SCREEN_H * 0.52;

// ─── Theme ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#FAFAFA',
  surface: '#FFFFFF',
  ink: '#111111',
  inkSoft: '#6B6B6B',
  inkMuted: '#9A9A9A',
  line: '#EBEBEB',
  accent: '#FF3B5C',
  accentSoft: '#FFF0F3',
  sale: '#E63946',
  success: '#1A8F5B',
  gold: '#C9A227',
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

// ─── Mock data ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'women', label: 'Women', icon: 'woman-outline' },
  { id: 'men', label: 'Men', icon: 'man-outline' },
  { id: 'shoes', label: 'Shoes', icon: 'footsteps-outline' },
  { id: 'bags', label: 'Bags', icon: 'bag-outline' },
  { id: 'sport', label: 'Sport', icon: 'fitness-outline' },
  { id: 'sale', label: 'Sale', icon: 'pricetag-outline' },
];

const HERO_SLIDES = [
  {
    id: 'h1',
    title: 'Spring Drop',
    subtitle: 'Up to 40% off new season',
    cta: 'Shop now',
    image: 'https://images.unsplash.com/photo-1483985988354-763728e3685b?w=900&q=80',
    gradient: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.65)'],
  },
  {
    id: 'h2',
    title: 'Street Essentials',
    subtitle: 'Limited edition collabs',
    cta: 'Explore',
    image: 'https://images.unsplash.com/photo-1558171813-4c088754af8f?w=900&q=80',
    gradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)'],
  },
  {
    id: 'h3',
    title: 'Minimal Luxe',
    subtitle: 'Premium fabrics, everyday wear',
    cta: 'Discover',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80',
    gradient: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.6)'],
  },
];

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Oversized Linen Blazer',
    brand: 'NØRD Studio',
    price: 89.99,
    originalPrice: 129.99,
    category: 'women',
    tag: 'Bestseller',
    rating: 4.8,
    colors: ['#E8DDD0', '#1A1A1A', '#8B4513'],
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    ],
    description: 'Relaxed-fit blazer in premium linen blend. Perfect for layering.',
  },
  {
    id: 'p2',
    name: 'High-Rise Wide Leg Jeans',
    brand: 'DENIM CO.',
    price: 59.99,
    originalPrice: null,
    category: 'women',
    tag: 'New',
    rating: 4.6,
    colors: ['#2C3E6B', '#1A1A1A'],
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
      'https://images.unsplash.com/photo-1584370848010-d7fe6ad070c5?w=800&q=80',
    ],
    description: 'Vintage wash denim with a flattering high-rise waist.',
  },
  {
    id: 'p3',
    name: 'Air Runner Pro',
    brand: 'VELOCITY',
    price: 119.99,
    originalPrice: 149.99,
    category: 'shoes',
    tag: '-20%',
    rating: 4.9,
    colors: ['#FFFFFF', '#111111', '#FF3B5C'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0a74cbfbf08b?w=800&q=80',
    ],
    description: 'Lightweight performance sneaker with responsive cushioning.',
  },
  {
    id: 'p4',
    name: 'Structured Leather Tote',
    brand: 'MAISON 47',
    price: 199.99,
    originalPrice: null,
    category: 'bags',
    tag: 'Premium',
    rating: 4.7,
    colors: ['#8B4513', '#1A1A1A'],
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    ],
    description: 'Italian leather tote with magnetic closure and inner pockets.',
  },
  {
    id: 'p5',
    name: 'Tech Fleece Hoodie',
    brand: 'URBAN PULSE',
    price: 74.99,
    originalPrice: 94.99,
    category: 'men',
    tag: 'Sale',
    rating: 4.5,
    colors: ['#2F4F4F', '#1A1A1A', '#F5F5DC'],
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    ],
    description: 'Brushed fleece interior with water-resistant outer shell.',
  },
  {
    id: 'p6',
    name: 'Seamless Sports Bra',
    brand: 'FLEX FORM',
    price: 39.99,
    originalPrice: null,
    category: 'sport',
    tag: 'New',
    rating: 4.8,
    colors: ['#FF3B5C', '#1A1A1A', '#6B8E9B'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      'https://images.unsplash.com/photo-1518310383802-640c2ed311cb?w=800&q=80',
    ],
    description: 'Medium support with moisture-wicking seamless knit.',
  },
  {
    id: 'p7',
    name: 'Wool Blend Overcoat',
    brand: 'NØRD Studio',
    price: 249.99,
    originalPrice: 329.99,
    category: 'men',
    tag: '-24%',
    rating: 4.9,
    colors: ['#4A4A4A', '#1B2838', '#8B7355'],
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    ],
    description: 'Double-breasted overcoat in Italian wool blend.',
  },
  {
    id: 'p8',
    name: 'Satin Midi Slip Dress',
    brand: 'LUMIÈRE',
    price: 69.99,
    originalPrice: null,
    category: 'women',
    tag: 'Trending',
    rating: 4.7,
    colors: ['#C9A0A0', '#1A1A1A', '#E8D5B7'],
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
    ],
    description: 'Bias-cut satin dress with adjustable straps.',
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => `€${n.toFixed(2)}`;
const discount = (price, original) =>
  original ? Math.round((1 - price / original) * 100) : 0;

// ─── Hooks ───────────────────────────────────────────────────────────────────
function usePressScale(toValue = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  return { scale, onPressIn, onPressOut };
}

function useFadeIn(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, useNativeDriver: true, speed: 14, bounciness: 6 }),
    ]).start();
  }, [delay, opacity, translateY]);
  return { opacity, translateY };
}

// ─── UI primitives ─────────────────────────────────────────────────────────────
function Toast({ message, visible, onHide }) {
  const translateY = useRef(new Animated.Value(-80)).current;
  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 8 }),
        Animated.delay(1800),
        Animated.timing(translateY, { toValue: -80, duration: 300, useNativeDriver: true }),
      ]).start(({ finished }) => finished && onHide?.());
    }
  }, [visible, translateY, onHide]);
  if (!visible) return null;
  return (
    <Animated.View style={[styles.toast, { transform: [{ translateY }] }]}>
      <Ionicons name="checkmark-circle" size={18} color={C.success} />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

function Badge({ label, variant = 'default' }) {
  const bg = variant === 'sale' ? C.sale : variant === 'new' ? C.ink : C.accentSoft;
  const color = variant === 'accent' ? C.accent : variant === 'sale' ? '#FFF' : C.ink;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

function IconBtn({ name, onPress, badge, size = 22, color = C.ink }) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.88);
  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.iconBtn, { transform: [{ scale }] }]}>
        <Ionicons name={name} size={size} color={color} />
        {badge > 0 && (
          <View style={styles.iconBadge}>
            <Text style={styles.iconBadgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

function ProductCard({ item, onPress, onFavorite, isFavorite, index = 0 }) {
  const fade = useFadeIn(index * 60);
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  const favScale = useRef(new Animated.Value(1)).current;
  const hasDiscount = item.originalPrice && item.originalPrice > item.price;

  const toggleFav = () => {
    Animated.sequence([
      Animated.spring(favScale, { toValue: 1.35, useNativeDriver: true, speed: 50 }),
      Animated.spring(favScale, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
    onFavorite(item.id);
  };

  return (
    <Animated.View style={{ opacity: fade.opacity, transform: [{ translateY: fade.translateY }, { scale }] }}>
      <Pressable onPress={() => onPress(item)} onPressIn={onPressIn} onPressOut={onPressOut}>
        <View style={styles.card}>
          <View style={styles.cardImageWrap}>
            <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
            {item.tag && (
              <View style={styles.cardTagWrap}>
                <Badge
                  label={item.tag}
                  variant={item.tag.includes('%') || item.tag === 'Sale' ? 'sale' : 'accent'}
                />
              </View>
            )}
            <Pressable style={styles.cardFavBtn} onPress={toggleFav} hitSlop={8}>
              <Animated.View style={{ transform: [{ scale: favScale }] }}>
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? C.accent : C.ink}
                />
              </Animated.View>
            </Pressable>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardBrand}>{item.brand}</Text>
            <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
            <View style={styles.cardPriceRow}>
              <Text style={styles.cardPrice}>{fmt(item.price)}</Text>
              {hasDiscount && (
                <>
                  <Text style={styles.cardOriginal}>{fmt(item.originalPrice)}</Text>
                  <Text style={styles.cardDiscount}>-{discount(item.price, item.originalPrice)}%</Text>
                </>
              )}
            </View>
            <View style={styles.cardRating}>
              <Ionicons name="star" size={12} color={C.gold} />
              <Text style={styles.cardRatingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function HeroCarousel({ onCtaPress }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % HERO_SLIDES.length;
        listRef.current?.scrollToOffset({ offset: next * SCREEN_W, animated: true });
        return next;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <View>
      <Animated.FlatList
        ref={listRef}
        data={HERO_SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W))}
        scrollEventThrottle={16}
        renderItem={({ item, index: i }) => {
          const inputRange = [(i - 1) * SCREEN_W, i * SCREEN_W, (i + 1) * SCREEN_W];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.92, 1, 0.92],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View style={{ width: SCREEN_W, height: HERO_H, transform: [{ scale }], opacity }}>
              <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
              <LinearGradient colors={item.gradient} style={StyleSheet.absoluteFill} />
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{item.title}</Text>
                <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
                <Pressable style={styles.heroCta} onPress={() => onCtaPress(item)}>
                  <Text style={styles.heroCtaText}>{item.cta}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFF" />
                </Pressable>
              </View>
            </Animated.View>
          );
        }}
      />
      <View style={styles.heroDots}>
        {HERO_SLIDES.map((s, i) => (
          <View key={s.id} style={[styles.heroDot, i === index && styles.heroDotActive]} />
        ))}
      </View>
    </View>
  );
}

function CategoryPill({ item, active, onPress }) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  return (
    <Pressable onPress={() => onPress(item.id)} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.catPill, active && styles.catPillActive, { transform: [{ scale }] }]}>
        <Ionicons name={item.icon} size={16} color={active ? '#FFF' : C.ink} />
        <Text style={[styles.catPillText, active && styles.catPillTextActive]}>{item.label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function SizeChip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.sizeChip, selected && styles.sizeChipSelected]}
    >
      <Text style={[styles.sizeChipText, selected && styles.sizeChipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function ColorDot({ color, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.colorDotWrap, selected && styles.colorDotSelected]}>
      <View style={[styles.colorDot, { backgroundColor: color }]} />
    </Pressable>
  );
}

function EmptyState({ icon, title, subtitle, action, onAction }) {
  const fade = useFadeIn(100);
  return (
    <Animated.View style={[styles.empty, { opacity: fade.opacity, transform: [{ translateY: fade.translateY }] }]}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={40} color={C.inkMuted} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
      {action && (
        <Pressable style={styles.emptyBtn} onPress={onAction}>
          <Text style={styles.emptyBtnText}>{action}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

// ─── Screens ─────────────────────────────────────────────────────────────────
function HomeScreen({ onProductPress, onFavorite, favorites, onShopPress }) {
  const [category, setCategory] = useState('all');
  const fade = useFadeIn(0);

  const filtered = useMemo(() => {
    if (category === 'all') return PRODUCTS;
    if (category === 'sale') return PRODUCTS.filter((p) => p.originalPrice);
    return PRODUCTS.filter((p) => p.category === category);
  }, [category]);

  const trending = PRODUCTS.slice(0, 4);

  return (
    <Animated.ScrollView
      style={{ opacity: fade.opacity }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.screenPad}
    >
      <HeroCarousel onCtaPress={() => onShopPress('sale')} />

      <View style={styles.section}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          <CategoryPill
            item={{ id: 'all', label: 'All', icon: 'grid-outline' }}
            active={category === 'all'}
            onPress={setCategory}
          />
          {CATEGORIES.map((c) => (
            <CategoryPill key={c.id} item={c} active={category === c.id} onPress={setCategory} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending now</Text>
        <Pressable onPress={() => onShopPress('all')}>
          <Text style={styles.sectionLink}>See all</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
        {trending.map((item, i) => (
          <View key={item.id} style={styles.hCard}>
            <ProductCard
              item={item}
              index={i}
              onPress={onProductPress}
              onFavorite={onFavorite}
              isFavorite={favorites.has(item.id)}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {category === 'all' ? 'New arrivals' : CATEGORIES.find((c) => c.id === category)?.label || 'Products'}
        </Text>
        <Text style={styles.sectionCount}>{filtered.length} items</Text>
      </View>
      <View style={styles.grid}>
        {filtered.map((item, i) => (
          <View key={item.id} style={styles.gridItem}>
            <ProductCard
              item={item}
              index={i}
              onPress={onProductPress}
              onFavorite={onFavorite}
              isFavorite={favorites.has(item.id)}
            />
          </View>
        ))}
      </View>
      <View style={{ height: 100 }} />
    </Animated.ScrollView>
  );
}

function ShopScreen({ onProductPress, onFavorite, favorites, initialCategory }) {
  const [category, setCategory] = useState(initialCategory || 'all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('popular');

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
  }, [initialCategory]);

  const results = useMemo(() => {
    let list = [...PRODUCTS];
    if (category !== 'all') {
      list = category === 'sale' ? list.filter((p) => p.originalPrice) : list.filter((p) => p.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, query, sort]);

  return (
    <View style={styles.flex}>
      <View style={styles.shopSearch}>
        <Ionicons name="search" size={18} color={C.inkMuted} />
        <TextInput
          style={styles.shopSearchInput}
          placeholder="Search brands, products..."
          placeholderTextColor={C.inkMuted}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={C.inkMuted} />
          </Pressable>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        <CategoryPill item={{ id: 'all', label: 'All', icon: 'grid-outline' }} active={category === 'all'} onPress={setCategory} />
        {CATEGORIES.map((c) => (
          <CategoryPill key={c.id} item={c} active={category === c.id} onPress={setCategory} />
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
        {[
          { id: 'popular', label: 'Popular' },
          { id: 'price-asc', label: 'Price ↑' },
          { id: 'price-desc', label: 'Price ↓' },
          { id: 'rating', label: 'Top rated' },
        ].map((s) => (
          <Pressable key={s.id} onPress={() => setSort(s.id)} style={[styles.sortChip, sort === s.id && styles.sortChipActive]}>
            <Text style={[styles.sortChipText, sort === s.id && styles.sortChipTextActive]}>{s.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.shopList}
        columnWrapperStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="search-outline" title="No results" subtitle="Try a different search or category" />
        }
        renderItem={({ item, index }) => (
          <View style={styles.gridItem}>
            <ProductCard
              item={item}
              index={index}
              onPress={onProductPress}
              onFavorite={onFavorite}
              isFavorite={favorites.has(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

function ProductDetailScreen({ product, onBack, onAddToCart, onFavorite, isFavorite }) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;
  const [size, setSize] = useState('M');
  const [color, setColor] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 0 }).start();
  }, [slideAnim]);

  const close = () => {
    Animated.timing(slideAnim, { toValue: SCREEN_H, duration: 280, useNativeDriver: true }).start(onBack);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <Animated.View style={[styles.detail, { transform: [{ translateY: slideAnim }] }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.detailImageWrap}>
          <Animated.FlatList
            data={product.images}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
              useNativeDriver: false,
            })}
            onMomentumScrollEnd={(e) => setImgIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W))}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.detailImage} resizeMode="cover" />
            )}
          />
          <LinearGradient colors={['rgba(0,0,0,0.35)', 'transparent']} style={styles.detailTopGrad} />
          <View style={[styles.detailTopBar, { paddingTop: insets.top + 8 }]}>
            <IconBtn name="close" onPress={close} color="#FFF" />
            <IconBtn
              name={isFavorite ? 'heart' : 'heart-outline'}
              onPress={() => onFavorite(product.id)}
              color={isFavorite ? C.accent : '#FFF'}
            />
          </View>
          <View style={styles.detailDots}>
            {product.images.map((_, i) => (
              <View key={i} style={[styles.heroDot, i === imgIndex && styles.heroDotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.detailBody}>
          <View style={styles.detailBrandRow}>
            <Text style={styles.detailBrand}>{product.brand}</Text>
            {product.tag && <Badge label={product.tag} variant={product.tag.includes('%') ? 'sale' : 'accent'} />}
          </View>
          <Text style={styles.detailName}>{product.name}</Text>
          <View style={styles.detailRating}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons key={s} name={s <= Math.floor(product.rating) ? 'star' : 'star-outline'} size={14} color={C.gold} />
            ))}
            <Text style={styles.detailRatingText}>{product.rating} · 128 reviews</Text>
          </View>
          <View style={styles.detailPriceRow}>
            <Text style={styles.detailPrice}>{fmt(product.price)}</Text>
            {hasDiscount && (
              <>
                <Text style={styles.detailOriginal}>{fmt(product.originalPrice)}</Text>
                <Badge label={`-${discount(product.price, product.originalPrice)}%`} variant="sale" />
              </>
            )}
          </View>

          <Text style={styles.detailSection}>Color</Text>
          <View style={styles.colorRow}>
            {product.colors.map((c, i) => (
              <ColorDot key={c} color={c} selected={color === i} onPress={() => setColor(i)} />
            ))}
          </View>

          <Text style={styles.detailSection}>Size</Text>
          <View style={styles.sizeRow}>
            {SIZES.map((s) => (
              <SizeChip key={s} label={s} selected={size === s} onPress={() => setSize(s)} />
            ))}
          </View>

          <Text style={styles.detailSection}>Description</Text>
          <Text style={styles.detailDesc}>{product.description}</Text>

          <View style={styles.detailPerks}>
            {[
              { icon: 'car-outline', text: 'Free delivery over €50' },
              { icon: 'refresh-outline', text: '100-day free returns' },
              { icon: 'shield-checkmark-outline', text: 'Authenticity guaranteed' },
            ].map((p) => (
              <View key={p.text} style={styles.perk}>
                <Ionicons name={p.icon} size={18} color={C.inkSoft} />
                <Text style={styles.perkText}>{p.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.detailFooter, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={styles.addToCartBtn}
          onPress={() => onAddToCart(product, size, product.colors[color])}
        >
          <Ionicons name="bag-add-outline" size={20} color="#FFF" />
          <Text style={styles.addToCartText}>Add to bag · {fmt(product.price)}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function CartItem({ item, index, onUpdateQty, onRemove }) {
  const fade = useFadeIn(index * 80);
  return (
    <Animated.View style={[styles.cartItem, { opacity: fade.opacity, transform: [{ translateY: fade.translateY }] }]}>
      <Image source={{ uri: item.product.image }} style={styles.cartThumb} />
      <View style={styles.cartInfo}>
        <Text style={styles.cartBrand}>{item.product.brand}</Text>
        <Text style={styles.cartName} numberOfLines={2}>{item.product.name}</Text>
        <View style={styles.cartMetaRow}>
          <Text style={styles.cartMeta}>{item.size}</Text>
          <View style={[styles.cartColorDot, { backgroundColor: item.color }]} />
        </View>
        <Text style={styles.cartPrice}>{fmt(item.product.price)}</Text>
      </View>
      <View style={styles.cartActions}>
        <Pressable onPress={() => onRemove(item.key)} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color={C.inkMuted} />
        </Pressable>
        <View style={styles.qtyRow}>
          <Pressable style={styles.qtyBtn} onPress={() => onUpdateQty(item.key, item.qty - 1)}>
            <Ionicons name="remove" size={16} color={C.ink} />
          </Pressable>
          <Text style={styles.qtyText}>{item.qty}</Text>
          <Pressable style={styles.qtyBtn} onPress={() => onUpdateQty(item.key, item.qty + 1)}>
            <Ionicons name="add" size={16} color={C.ink} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

function CartScreen({ items, onUpdateQty, onRemove, onCheckout }) {
  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const savings = items.reduce((sum, i) => {
    const orig = i.product.originalPrice || i.product.price;
    return sum + (orig - i.product.price) * i.qty;
  }, 0);

  if (items.length === 0) {
    return (
      <EmptyState
        icon="bag-outline"
        title="Your bag is empty"
        subtitle="Discover trending styles and add your favorites"
        action="Start shopping"
        onAction={() => {}}
      />
    );
  }

  return (
    <View style={styles.flex}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CartItem item={item} index={index} onUpdateQty={onUpdateQty} onRemove={onRemove} />
        )}
      />
      <View style={styles.cartSummary}>
        {savings > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>You save</Text>
            <Text style={[styles.summaryValue, { color: C.sale }]}>-{fmt(savings)}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotal}>Total</Text>
          <Text style={styles.summaryTotalValue}>{fmt(total)}</Text>
        </View>
        <Pressable style={styles.checkoutBtn} onPress={onCheckout}>
          <Text style={styles.checkoutText}>Checkout</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}

function FavoritesScreen({ favorites, products, onProductPress, onFavorite }) {
  const items = products.filter((p) => favorites.has(p.id));
  if (items.length === 0) {
    return (
      <EmptyState
        icon="heart-outline"
        title="No favorites yet"
        subtitle="Tap the heart on items you love"
      />
    );
  }
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.shopList}
      columnWrapperStyle={styles.grid}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <View style={styles.gridItem}>
          <ProductCard
            item={item}
            index={index}
            onPress={onProductPress}
            onFavorite={onFavorite}
            isFavorite
          />
        </View>
      )}
    />
  );
}

function ProfileScreen() {
  const fade = useFadeIn(0);
  const menu = [
    { icon: 'person-outline', label: 'Account details' },
    { icon: 'location-outline', label: 'Addresses' },
    { icon: 'card-outline', label: 'Payment methods' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'help-circle-outline', label: 'Help & support' },
    { icon: 'document-text-outline', label: 'Orders' },
  ];

  return (
    <Animated.ScrollView style={{ opacity: fade.opacity }} contentContainerStyle={styles.profilePad}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AF</Text>
        </View>
        <View>
          <Text style={styles.profileName}>Alex Fashion</Text>
          <Text style={styles.profileEmail}>alex@example.com</Text>
        </View>
      </View>

      <View style={styles.loyaltyCard}>
        <LinearGradient colors={['#1A1A1A', '#333']} style={styles.loyaltyGrad}>
          <Text style={styles.loyaltyLabel}>STYLE CLUB</Text>
          <Text style={styles.loyaltyPoints}>2,450 pts</Text>
          <Text style={styles.loyaltyHint}>€25 reward at 3,000 pts</Text>
          <View style={styles.loyaltyBar}>
            <View style={[styles.loyaltyFill, { width: '82%' }]} />
          </View>
        </LinearGradient>
      </View>

      {menu.map((m, i) => (
        <Pressable key={m.label} style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name={m.icon} size={20} color={C.ink} />
            <Text style={styles.menuLabel}>{m.label}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.inkMuted} />
        </Pressable>
      ))}
      <View style={{ height: 100 }} />
    </Animated.ScrollView>
  );
}

// ─── Tab bar ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { id: 'shop', label: 'Shop', icon: 'search-outline', activeIcon: 'search' },
  { id: 'favorites', label: 'Wishlist', icon: 'heart-outline', activeIcon: 'heart' },
  { id: 'cart', label: 'Bag', icon: 'bag-outline', activeIcon: 'bag' },
  { id: 'profile', label: 'You', icon: 'person-outline', activeIcon: 'person' },
];

function TabBar({ active, onChange, cartCount }) {
  const insets = useSafeAreaInsets();
  const indicatorX = useRef(new Animated.Value(0)).current;
  const tabW = SCREEN_W / TABS.length;

  useEffect(() => {
    const idx = TABS.findIndex((t) => t.id === active);
    Animated.spring(indicatorX, {
      toValue: idx * tabW + tabW / 2 - 16,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  }, [active, indicatorX, tabW]);

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Animated.View style={[styles.tabIndicator, { transform: [{ translateX: indicatorX }] }]} />
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const { scale, onPressIn, onPressOut } = usePressScale(0.9);
        return (
          <Pressable
            key={tab.id}
            style={styles.tab}
            onPress={() => onChange(tab.id)}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Animated.View style={{ alignItems: 'center', transform: [{ scale }] }}>
              <View>
                <Ionicons name={isActive ? tab.activeIcon : tab.icon} size={22} color={isActive ? C.ink : C.inkMuted} />
                {tab.id === 'cart' && cartCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
function AppContent() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('home');
  const [shopCategory, setShopCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set(['p1', 'p3']));
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Removed from wishlist');
      } else {
        next.add(id);
        showToast('Added to wishlist');
      }
      return next;
    });
  }, [showToast]);

  const addToCart = useCallback((product, size, color) => {
    const key = `${product.id}-${size}-${color}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { key, product, size, color, qty: 1 }];
    });
    showToast(`Added ${product.name} to bag`);
    setSelectedProduct(null);
  }, [showToast]);

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) {
      setCart((prev) => prev.filter((i) => i.key !== key));
      showToast('Item removed');
    } else {
      setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
    }
  }, [showToast]);

  const removeItem = useCallback((key) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
    showToast('Item removed');
  }, [showToast]);

  const goShop = useCallback((cat) => {
    setShopCategory(cat);
    setTab('shop');
  }, []);

  const screenTitle = {
    home: 'VELO',
    shop: 'Shop',
    favorites: 'Wishlist',
    cart: 'Your bag',
    profile: 'Account',
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />
      <ExpoStatusBar style="dark" />

      {tab !== 'home' && (
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.headerLogo}>{screenTitle[tab]}</Text>
          {tab === 'shop' && <IconBtn name="options-outline" onPress={() => {}} />}
        </View>
      )}

      {tab === 'home' && (
        <View style={[styles.homeHeader, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.headerLogo}>VELO</Text>
          <View style={styles.homeHeaderRight}>
            <IconBtn name="notifications-outline" onPress={() => showToast('No new notifications')} />
          </View>
        </View>
      )}

      <View style={styles.flex}>
        {tab === 'home' && (
          <HomeScreen
            onProductPress={setSelectedProduct}
            onFavorite={toggleFavorite}
            favorites={favorites}
            onShopPress={goShop}
          />
        )}
        {tab === 'shop' && (
          <ShopScreen
            onProductPress={setSelectedProduct}
            onFavorite={toggleFavorite}
            favorites={favorites}
            initialCategory={shopCategory}
          />
        )}
        {tab === 'favorites' && (
          <FavoritesScreen
            favorites={favorites}
            products={PRODUCTS}
            onProductPress={setSelectedProduct}
            onFavorite={toggleFavorite}
          />
        )}
        {tab === 'cart' && (
          <CartScreen
            items={cart}
            onUpdateQty={updateQty}
            onRemove={removeItem}
            onCheckout={() => setCheckoutVisible(true)}
          />
        )}
        {tab === 'profile' && <ProfileScreen />}
      </View>

      <TabBar active={tab} onChange={setTab} cartCount={cartCount} />

      {selectedProduct && (
        <Modal visible animationType="none" transparent statusBarTranslucent>
          <ProductDetailScreen
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onAddToCart={addToCart}
            onFavorite={toggleFavorite}
            isFavorite={favorites.has(selectedProduct.id)}
          />
        </Modal>
      )}

      <Modal visible={checkoutVisible} animationType="slide" transparent>
        <View style={styles.checkoutOverlay}>
          <View style={styles.checkoutSheet}>
            <View style={styles.checkoutIcon}>
              <Ionicons name="checkmark-circle" size={56} color={C.success} />
            </View>
            <Text style={styles.checkoutTitle}>Order placed!</Text>
            <Text style={styles.checkoutSub}>
              Thank you for shopping with VELO. You'll receive a confirmation email shortly.
            </Text>
            <Pressable
              style={styles.checkoutBtn}
              onPress={() => {
                setCheckoutVisible(false);
                setCart([]);
                setTab('home');
              }}
            >
              <Text style={styles.checkoutText}>Continue shopping</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Toast message={toast.message} visible={toast.visible} onHide={() => setToast({ visible: false, message: '' })} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: C.bg },
  screenPad: { paddingBottom: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: C.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.line,
  },
  homeHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  homeHeaderRight: { flexDirection: 'row', gap: 4 },
  headerLogo: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 4,
    color: C.ink,
  },

  // Hero
  heroContent: {
    position: 'absolute',
    bottom: 48,
    left: 24,
    right: 24,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    marginBottom: 20,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    backgroundColor: C.ink,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  heroCtaText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  heroDots: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  heroDotActive: { width: 20, backgroundColor: '#FFF' },

  // Categories
  section: { marginTop: 20 },
  catRow: { paddingHorizontal: 16, gap: 8, paddingVertical: 4 },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
  },
  catPillActive: { backgroundColor: C.ink, borderColor: C.ink },
  catPillText: { fontSize: 13, fontWeight: '600', color: C.ink },
  catPillTextActive: { color: '#FFF' },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: C.ink },
  sectionLink: { fontSize: 14, fontWeight: '600', color: C.accent },
  sectionCount: { fontSize: 13, color: C.inkMuted },

  // Product card
  hScroll: { paddingHorizontal: 16, gap: 12 },
  hCard: { width: CARD_W },
  grid: { paddingHorizontal: 16, gap: 12 },
  gridItem: { width: CARD_W },
  card: {
    backgroundColor: C.surface,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  cardImageWrap: { position: 'relative', height: CARD_W * 1.25 },
  cardImage: { width: '100%', height: '100%' },
  cardTagWrap: { position: 'absolute', top: 10, left: 10 },
  cardFavBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { padding: 12 },
  cardBrand: { fontSize: 11, fontWeight: '600', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardName: { fontSize: 14, fontWeight: '600', color: C.ink, marginTop: 4, lineHeight: 18 },
  cardPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  cardPrice: { fontSize: 15, fontWeight: '700', color: C.ink },
  cardOriginal: { fontSize: 12, color: C.inkMuted, textDecorationLine: 'line-through' },
  cardDiscount: { fontSize: 11, fontWeight: '700', color: C.sale },
  cardRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  cardRatingText: { fontSize: 12, color: C.inkSoft },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },

  // Shop
  shopSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.line,
  },
  shopSearchInput: { flex: 1, fontSize: 15, color: C.ink, padding: 0 },
  sortRow: { paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  sortChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
  },
  sortChipActive: { backgroundColor: C.ink, borderColor: C.ink },
  sortChipText: { fontSize: 12, fontWeight: '600', color: C.inkSoft },
  sortChipTextActive: { color: '#FFF' },
  shopList: { paddingBottom: 120, paddingTop: 8 },

  // Detail
  detail: {
    flex: 1,
    backgroundColor: C.surface,
  },
  detailImageWrap: { height: SCREEN_H * 0.55, position: 'relative' },
  detailImage: { width: SCREEN_W, height: SCREEN_H * 0.55 },
  detailTopGrad: { position: 'absolute', top: 0, left: 0, right: 0, height: 120 },
  detailTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  detailDots: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  detailBody: { padding: 20 },
  detailBrandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailBrand: { fontSize: 13, fontWeight: '600', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 1 },
  detailName: { fontSize: 24, fontWeight: '700', color: C.ink, marginTop: 8, lineHeight: 30 },
  detailRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  detailRatingText: { fontSize: 13, color: C.inkSoft, marginLeft: 4 },
  detailPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  detailPrice: { fontSize: 26, fontWeight: '800', color: C.ink },
  detailOriginal: { fontSize: 16, color: C.inkMuted, textDecorationLine: 'line-through' },
  detailSection: { fontSize: 15, fontWeight: '700', color: C.ink, marginTop: 24, marginBottom: 12 },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorDotWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: { borderColor: C.ink },
  colorDot: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: C.line },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sizeChip: {
    minWidth: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
  },
  sizeChipSelected: { backgroundColor: C.ink, borderColor: C.ink },
  sizeChipText: { fontSize: 14, fontWeight: '600', color: C.ink },
  sizeChipTextSelected: { color: '#FFF' },
  detailDesc: { fontSize: 15, lineHeight: 22, color: C.inkSoft },
  detailPerks: { marginTop: 24, gap: 12 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  perkText: { fontSize: 14, color: C.inkSoft },
  detailFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
    backgroundColor: C.surface,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: C.ink,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addToCartText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  // Cart
  cartList: { padding: 16, paddingBottom: 8 },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  cartThumb: { width: 88, height: 110, borderRadius: 8 },
  cartInfo: { flex: 1 },
  cartBrand: { fontSize: 11, fontWeight: '600', color: C.inkMuted, textTransform: 'uppercase' },
  cartName: { fontSize: 14, fontWeight: '600', color: C.ink, marginTop: 2 },
  cartMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cartMeta: { fontSize: 12, color: C.inkSoft },
  cartColorDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1, borderColor: C.line },
  cartPrice: { fontSize: 15, fontWeight: '700', color: C.ink, marginTop: 8 },
  cartActions: { alignItems: 'flex-end', justifyContent: 'space-between' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { fontSize: 15, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  cartSummary: {
    padding: 20,
    backgroundColor: C.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: C.inkSoft },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  summaryTotal: { fontSize: 18, fontWeight: '700', color: C.ink },
  summaryTotalValue: { fontSize: 18, fontWeight: '800', color: C.ink },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.ink,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  checkoutText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  // Profile
  profilePad: { padding: 20 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  profileName: { fontSize: 20, fontWeight: '700', color: C.ink },
  profileEmail: { fontSize: 14, color: C.inkSoft, marginTop: 2 },
  loyaltyCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  loyaltyGrad: { padding: 20 },
  loyaltyLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 2 },
  loyaltyPoints: { fontSize: 28, fontWeight: '800', color: '#FFF', marginTop: 4 },
  loyaltyHint: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  loyaltyBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: 16 },
  loyaltyFill: { height: 4, backgroundColor: C.accent, borderRadius: 2 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.line,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuLabel: { fontSize: 16, fontWeight: '500', color: C.ink },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
    paddingTop: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 8 },
    }),
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.ink,
  },
  tab: { flex: 1, alignItems: 'center' },
  tabLabel: { fontSize: 10, fontWeight: '500', color: C.inkMuted, marginTop: 4 },
  tabLabelActive: { color: C.ink, fontWeight: '700' },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFF' },

  // Icons
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  iconBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeText: { fontSize: 8, fontWeight: '800', color: '#FFF' },

  // Toast
  toast: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.surface,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  toastText: { fontSize: 14, fontWeight: '600', color: C.ink },

  // Empty
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: C.ink },
  emptySubtitle: { fontSize: 14, color: C.inkSoft, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  emptyBtn: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: C.ink,
    borderRadius: 24,
  },
  emptyBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  // Checkout modal
  checkoutOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  checkoutSheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  checkoutIcon: { marginBottom: 16 },
  checkoutTitle: { fontSize: 24, fontWeight: '800', color: C.ink },
  checkoutSub: { fontSize: 15, color: C.inkSoft, textAlign: 'center', marginTop: 8, lineHeight: 22 },
});

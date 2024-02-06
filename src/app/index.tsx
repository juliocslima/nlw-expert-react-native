import { CategoryButton } from "@/components/category-button";
import { Header } from "@/components/header";
import { View, FlatList } from "react-native";

import { CATEGORIES } from "@/utils/data/products"
import { useState } from "react";

export default function Home() {

  const [category, setCategory] = useState('');

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory)
  }

  return (
    <View className="bg-slate-900 flex-1">
      <Header title="Cardápio"cartQuantityItems={5}/>

      <FlatList 
        data={CATEGORIES} 
        keyExtractor={(item) => item}
        renderItem={({ item }) => <CategoryButton title={item} isSelected={item === category} onPress={() => handleCategorySelect(item)}/>}
        horizontal
        className="max-h-10 mt-5"
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
        showsHorizontalScrollIndicator = {false}
      />
    </View>
  );
}
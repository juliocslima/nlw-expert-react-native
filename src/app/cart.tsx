import { useState } from "react";
import { Alert, ScrollView, Text, View, Linking } from "react-native";
import { useNavigation } from "expo-router";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Feather } from "@expo/vector-icons";

import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { FormatCurrency } from "@/utils/functions/formatCurrency";

import { Header } from "@/components/header";
import { LinkButton } from "@/components/link-button";
import { Product } from "@/components/product";
import { Input } from "@/components/Input";
import { Button } from "@/components/button";

// Informar o numero do celular da lanchonete/restaurante, 
// na variavel PHONE_NUMBER abaixo, p.ex.: 5511961231234
const PHONE_NUMBER = "";

export default function Cart() {
  const [address, setAddress] = useState('');
  const cartStore = useCartStore();
  const navigation = useNavigation();

  const total = FormatCurrency(cartStore.products.reduce((total, product) => 
    total += product.price * product.quantity, 0
  ))

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert('Remover', `Deseja remover o produto ${product.title} do carrinho`, [
      {
        text: 'Cancelar'
      },
      {
        text: 'Remover',
        onPress: () => cartStore.remove(product.id)
      },
    ]);
  }

  function handleOrder() {
    if(address.trim().length === 0) {
      return Alert.alert("Pedido", "Informe os dados para entrega.");
    }

    const products = cartStore.products
      .map((product) => `\n${product.quantity}x ${product.title}`)
      .join("")

    const message = `🍔 NOVO PEDIDO
    \nEntregar em: ${address}
    \n${products}

    \nValor Total: ${total}
    `

    // Para enviar mensagem via WhatsApp
    // 1. Informar número do celular para envio da mensagem na variável PHONE_NUMBER
    // 2. Retirar o comentário da linha abaixo
    //Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`);

    cartStore.clear();
    navigation.goBack();
  }

  return(
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho" />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={100}
      >
      <ScrollView>
        <View className="flex-1 p-5">
        { cartStore.products.length > 0 ? (
          <View className="border-b border-slate-700">
            {
              cartStore.products.map( (product) => (
                <Product 
                  key={product.id} 
                  data={product} 
                  onPress={() => handleProductRemove(product)}
                />
              ))
            }
          </View>
        ) : (
          <Text className="font-body text-slate-400 text-center my-8">
            Seu carrinho está vazio.
          </Text>
        ) }
        </View>

        <View className="flex-row gap-2 items-center mt-5 mb-4 px-5 justify-between">
          <Text className="text-white text-xl font-subtitle">
            Total: 
          </Text>
          <Text className="text-lime-400 text-2xl font-heading">
            { total }
          </Text>
        </View>

        <Input 
          placeholder="Informe seu endereço de entrega com rua, bairro, CEP, número e complemento ..." 
          onChangeText={setAddress}
          blurOnSubmit={true}
          onSubmitEditing={handleOrder}
          returnKeyType="next"
        />

        <View className="p-5 pb-8 gap-5">
          <Button onPress={handleOrder}>
            <Button.Icon>
              <Feather name="arrow-right-circle" size={20} />
            </Button.Icon>
            <Button.Text>
              Enviar pedido
            </Button.Text>
          </Button>

          <LinkButton title="voltar ao cardápio" href="/" />
        </View>
      </ScrollView>
      </KeyboardAwareScrollView>
    </View>   
  ) 
}
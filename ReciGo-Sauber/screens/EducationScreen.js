import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import MainLayout from '../components/MainLayout';
import AppLogo from '../components/AppLogo';

const BRAND = '#22C55E';

export const educationItems = [
  {
    id: 1,
    category: 'Plástico',
    title: 'Tipos de plástico reciclable',
    icon: 'recycle',
    color: '#3B82F6',
    content: {
      coverImage: 'https://images.pexels.com/photos/7767813/pexels-photo-7767813.jpeg',
      youtubeId: 'BhjrN_TMmiU',
      intro: 'El plástico es uno de los materiales más usados en el mundo pero también uno de los más contaminantes. La buena noticia es que muchos tipos se pueden reciclar si los separamos correctamente.',
      sections: [
        {
          subtitle: 'Paso 1: Identifica el tipo de plástico',
          text: 'En el fondo de cada envase hay un triángulo con un número del 1 al 7. Ese número indica el tipo de plástico y si se puede reciclar fácilmente. Los números 1 (PET) y 2 (HDPE) son los más reciclables.',
          image: 'https://gestorderesiduosmadrid.es/wp-content/uploads/2024/01/codigos-reciclaje-plasticos-receco-600.jpg',
        },
        {
          subtitle: 'Paso 2: Limpia los envases',
          text: 'Enjuaga bien cada envase antes de reciclarlo. Los restos de comida o líquido contaminan toda la carga y hacen que no se pueda reciclar. No necesitas jabón, con agua es suficiente.',
          image: 'https://media.quepasa.com.ve/site/wp-content/uploads/2020/09/agua-botella-b-750x400.jpg',
        },
        {
          subtitle: 'Paso 3: Retira tapas y etiquetas',
          text: 'Las tapas y etiquetas son de materiales distintos al envase. Quítalas antes de reciclar. Las tapas plásticas también se pueden reciclar pero van separadas.',
          image: 'https://www.realsimple.com/thmb/Kz4TE6YStfWbxuXiNNOPDBPNWRU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/home-green-living-plastic-bottle-caps-recylable-01-realsimple-a0c76a8b47d2463ca9d3b0d68c0e3a38.jpg',
        },
        {
          subtitle: 'Paso 4: Llévalo al punto de recolección',
          text: 'Deposita los envases limpios en el contenedor amarillo o en el punto de reciclaje más cercano. Aplasta las botellas para que ocupen menos espacio.',
          image: 'https://img.magnific.com/vector-gratis/vector-conjunto-papeleras-reciclaje-amarillas-clasificacion-residuos-plasticos_1284-48007.jpg',
        },
        {
          subtitle: 'Paso 5: ¿En qué se convierte el plástico reciclado?',
          text: 'El plástico reciclado se convierte en ropa, muebles, tuberías, bolsas y nuevos envases. Una botella PET reciclada puede convertirse en fibra para hacer camisetas.',
          image: 'https://purodiseno.lat/wp-content/uploads/2020/02/secondnature_project_37052804_271378376968590_9034607339432312832_n-1024x738.jpg',
        },
      ],
      tip: 'Busca el número dentro del triángulo en el fondo del envase. Los números 1 y 2 son los más fáciles de reciclar y los más aceptados en los puntos de recolección.',
      credits: 'Imágenes: Pexels.com, gestorderesiduosmadrid.es, quepasa.com.ve, realsimple.com, magnific.com, purodiseno.lat · Videos: YouTube',
    },
  },
  {
    id: 2,
    category: 'Cartón',
    title: 'Cómo preparar cartón para reciclar',
    icon: 'cube-outline',
    color: '#F59E0B',
    content: {
      coverImage: 'https://images.unsplash.com/photo-1654078054613-a56cfcabdb84?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      youtubeId: 'SmoR5dr-OC4',
      intro: 'El cartón es uno de los materiales más fáciles de reciclar, pero si llega sucio o húmedo al centro de reciclaje no sirve de nada. Aprende a prepararlo correctamente.',
      sections: [
        {
          subtitle: 'Paso 1: Identifica qué es cartón reciclable',
          text: 'Las cajas de cartón corrugado, cajas de cereales, rollos de papel higiénico y papel de periódico son reciclables. El cartón limpio y seco es el ideal para reciclar.',
          image: 'https://images.unsplash.com/photo-1513672494107-cd9d848a383e?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          subtitle: 'Paso 2: Vacía y aplana las cajas',
          text: 'Retira todo el contenido, quita grapas metálicas y aplana las cajas. Así ocupan menos espacio, son más fáciles de transportar y caben más en el contenedor.',
          image: 'https://images.pexels.com/photos/7203976/pexels-photo-7203976.jpeg',
        },
        {
          subtitle: 'Paso 3: Revisa que no tenga grasa ni comida',
          text: 'Las cajas de pizza o cualquier cartón con restos de grasa o comida NO se pueden reciclar porque contaminan toda la carga. Corta y bota la parte sucia; la parte limpia sí va al contenedor.',
          image: 'https://images.pexels.com/photos/9353454/pexels-photo-9353454.jpeg',
        },
        {
          subtitle: 'Paso 4: Retira cinta adhesiva y grapas',
          text: 'La cinta adhesiva y las grapas metálicas no son cartón. Retíralas antes de reciclar para obtener cartón reciclado de mejor calidad.',
          image: 'https://images.pexels.com/photos/4246111/pexels-photo-4246111.jpeg',
        },
        {
          subtitle: 'Paso 5: Tetra Brik va aparte',
          text: 'Los envases de leche, jugo y crema de leche NO van con el cartón. Son multicapa (plástico + cartón + aluminio) y necesitan un proceso especial. Deposítalos en el contenedor amarillo.',
          image: 'https://img.freepik.com/vector-gratis/modelo-envase-blanco-blanco-3d-carton-leche-o-jugo_107791-28174.jpg?semt=ais_hybrid&w=740&q=80',
        },
        {
          subtitle: 'Paso 6: Llévalo al punto de reciclaje seco',
          text: 'Deposita el cartón aplanado en el contenedor azul o en el punto de recolección más cercano. Guárdalo en un lugar seco hasta llevarlo, la humedad destruye las fibras.',
          image: 'https://images.pexels.com/photos/9324347/pexels-photo-9324347.jpeg',
        },
      ],
      tip: 'Si la caja tiene parte limpia y parte sucia, no la botes entera. Córtala, recicla la parte limpia y bota solo la parte contaminada.',
      credits: 'Imágenes: Unsplash, Pexels, Freepik · Videos: YouTube',
    },
  },
  {
    id: 3,
    category: 'Vidrio',
    title: 'El vidrio: infinitamente reciclable',
    icon: 'glass-fragile',
    color: '#8B5CF6',
    content: {
      coverImage: 'https://images.pexels.com/photos/18799752/pexels-photo-18799752.jpeg',
      youtubeId: 'gihYVyxS6ak',
      intro: 'El vidrio es uno de los pocos materiales que se puede reciclar infinitas veces sin perder calidad. Reciclarlo ahorra energía y reduce la extracción de arena y minerales.',
      sections: [
        {
          subtitle: 'Paso 1: ¿Qué vidrio se puede reciclar?',
          text: 'Botellas de vino, cerveza, gaseosa y agua; frascos de conservas, mermelada, salsas y perfumes. Todos deben ir vacíos y sin tapas.',
          image: 'https://images.unsplash.com/photo-1608745167260-e15bc0e0521f?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          subtitle: 'Paso 2: Vacía y enjuaga los envases',
          text: 'No hace falta lavarlos a fondo, pero sí vaciarlos completamente. Un enjuague rápido con agua es suficiente para eliminar restos y evitar malos olores.',
          image: 'https://imgmedia.larepublica.pe/850x501/larepublica/original/2022/05/08/62784dad5ac74a165715c34a.webp',
        },
        {
          subtitle: 'Paso 3: Retira tapas y corchos',
          text: 'Las tapas metálicas, plásticas y los corchos son de materiales distintos al vidrio. Quítalos antes de reciclar. Las tapas metálicas pueden ir al contenedor amarillo.',
          image: 'https://images.unsplash.com/photo-1678942953384-91aae690abd1?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          subtitle: 'Paso 4: Qué NO va en el contenedor de vidrio',
          text: 'Espejos, ventanas, bombillas, vidrio de gafas, cerámica y porcelana tienen composiciones distintas que arruinan el proceso de fusión. Llévalos a un punto limpio.',
          image: 'https://images.pexels.com/photos/36290319/pexels-photo-36290319.jpeg',
        },
        {
          subtitle: 'Paso 5: Llévalo al contenedor verde',
          text: 'Deposita los envases uno a uno en el contenedor verde para evitar que se rompan. Intenta no tirarlos desde muy alto para reducir el ruido.',
          image: 'https://i.pinimg.com/474x/03/03/db/0303db238d253413f8e893e1e83d602a.jpg',
        },
        {
          subtitle: 'Paso 6: ¿En qué se convierte el vidrio reciclado?',
          text: 'El vidrio reciclado se convierte en nuevas botellas y frascos, fibra de vidrio para construcción, abrasivos industriales y material decorativo. El ciclo es infinito.',
          image: 'https://cdn.shopify.com/s/files/1/0593/4235/6578/files/Glass-Recycling-25001.gif?v=1754209066',
        },
      ],
      tip: 'El vidrio no tiene fecha de caducidad para reciclarse. Una botella puede esperar meses en tu casa antes de ir al contenedor y seguirá siendo 100% reciclable.',
      credits: 'Imágenes: Pexels, Unsplash, larepublica.pe, Pinterest, Shopify · Videos: YouTube',
    },
  },
  {
    id: 4,
    category: 'Metal',
    title: 'Importancia del reciclaje de metal',
    icon: 'tools',
    color: '#6B7280',
    content: {
      coverImage: 'https://images.pexels.com/photos/6591436/pexels-photo-6591436.jpeg',
      youtubeId: 'SUL8l7Rx2V0',
      intro: 'Los metales son materiales muy valiosos que se pueden reciclar casi indefinidamente. Reciclar aluminio consume un 95% menos de energía que producirlo desde cero.',
      sections: [
        {
          subtitle: 'Paso 1: ¿Qué metales se pueden reciclar?',
          text: 'Latas de gaseosa, cerveza y conservas; papel de aluminio, tapas de frascos y bandejas. También aerosoles vacíos, cables y piezas metálicas pequeñas.',
          image: 'https://images.pexels.com/photos/5538237/pexels-photo-5538237.jpeg',
        },
        {
          subtitle: 'Paso 2: Limpia y aplasta las latas',
          text: 'Enjuaga las latas para eliminar restos de líquido o comida. Aplástalas con el pie para que ocupen menos espacio en el contenedor y en tu casa.',
          image: 'https://images.pexels.com/photos/31027565/pexels-photo-31027565.jpeg',
        },
        {
          subtitle: 'Paso 3: Retira restos de comida',
          text: 'Las latas de atún, frijoles o cualquier conserva deben estar limpias por dentro antes de reciclarlas. Un enjuague rápido es suficiente.',
          image: 'https://www.minutoneuquen.com/u/fotografias/m/2024/12/7/f685x385-755590_793283_483.jpg',
        },
        {
          subtitle: 'Paso 4: Aerosoles — asegúrate de que estén vacíos',
          text: 'Los botes de aerosol son reciclables pero SOLO si están completamente vacíos. Presiona hasta que no salga nada más. Nunca los perfores ni los tires al fuego.',
          image: 'https://images.unsplash.com/photo-1641428744718-7669981e02f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          subtitle: 'Paso 5: Metales grandes van aparte',
          text: 'Cables, tuberías, electrodomésticos y piezas mecánicas no van al contenedor doméstico. Llévalos a un chatarrero o punto limpio, donde además tienen valor económico.',
          image: 'https://images.pexels.com/photos/5279317/pexels-photo-5279317.jpeg',
        },
        {
          subtitle: 'Paso 6: Llévalo al contenedor amarillo',
          text: 'Las latas y envases metálicos pequeños van al contenedor amarillo junto con los plásticos. Asegúrate de que estén limpios y aplastados antes de depositarlos.',
          image: 'https://images.unsplash.com/photo-1640864790113-cfa093807171?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      ],
      tip: 'Vender chatarra en un chatarrero local es una forma de generar ingresos extra y apoyar la economía circular de tu comunidad.',
      credits: 'Imágenes: Pexels, Unsplash, minutoneuquen.com · Videos: YouTube',
    },
  },
  {
    id: 5,
    category: 'Orgánico',
    title: 'Compostaje de residuos orgánicos',
    icon: 'leaf',
    color: '#10B981',
    content: {
      coverImage: 'https://cdn.cpdonline.co.uk/wp-content/uploads/2022/02/28105801/Composting-waste.jpg',
      youtubeId: '6j8oHR4qzhM',
      intro: 'Los residuos orgánicos son más del 50% de la basura doméstica. En lugar de ir al relleno sanitario, pueden convertirse en abono natural para tus plantas en pocas semanas.',
      sections: [
        {
          subtitle: 'Paso 1: ¿Qué es un residuo orgánico?',
          text: 'Son todos los restos de origen natural: frutas, verduras, cáscaras, restos de jardín y alimentos. Se descomponen solos y pueden aprovecharse como abono en lugar de contaminar.',
          image: 'https://images.pexels.com/photos/14824327/pexels-photo-14824327.jpeg',
        },
        {
          subtitle: 'Paso 2: Qué SÍ puedes compostar',
          text: 'Cáscaras de frutas y verduras, huevos, posos de café, bolsitas de té, restos de poda, hojas secas y cartón sin tintas brillantes. Todo esto se convierte en abono rico en nutrientes.',
          image: 'https://images.unsplash.com/photo-1539875572086-625ee0a23814?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          subtitle: 'Paso 3: Qué NO debes compostar',
          text: 'Carne, pescado, lácteos y aceites atraen plagas y generan malos olores. Tampoco excrementos de animales carnívoros, plantas enfermas ni materiales con químicos.',
          image: 'https://d2yoo3qu6vrk5d.cloudfront.net/images/20220725171626/cropped-1-2022-07-25t171530-241-3.webp',
        },
        {
          subtitle: 'Paso 4: Arma tu compostera',
          text: 'Puedes usar un balde con tapa, una caja de madera o comprar una compostera. Solo necesita ventilación y un lugar fresco. En apartamento funciona perfectamente en el balcón.',
          image: 'https://plus.unsplash.com/premium_photo-1663100339331-eae4b45f5e18?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          subtitle: 'Paso 5: La clave — proporción verde-marrón',
          text: 'Mezcla restos húmedos de cocina como frutas y verduras (verde) con hojas secas o cartón (marrón) en proporción 1:2. Remueve cada semana para airear y mantén humedad moderada.',
          image: 'https://quedigital.com.ar/web/wp-content/uploads/2022/04/COMPOST-BASURA-ORGANICA-44-1200x675.jpg',
        },
        {
          subtitle: 'Paso 6: El compost está listo',
          text: 'En 2 o 3 meses el compost estará listo cuando tenga color oscuro, olor a tierra húmeda y textura suelta. Úsalo en tus plantas, jardín o dónalo a vecinos con huerta.',
          image: 'https://www.greencut-tools.com/blog/wp-content/uploads/2024/08/compost-concepto-naturaleza-muerta_23-2149068983.jpg',
        },
      ],
      tip: 'Si vivís en apartamento, una lombricompostera pequeña cabe en el balcón y no genera olores si se mantiene bien. ¡Son fáciles de conseguir en ferias ecológicas!',
      credits: 'Imágenes: cpdonline.co.uk, Pexels, Unsplash, cloudfront.net, quedigital.com.ar, greencut-tools.com · Videos: YouTube',
    },
  },
];

const Header = () => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <AppLogo size={40} />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.headerTitle}>ReciGo</Text>
        <Text style={styles.headerSub}>Aplicación de reciclaje</Text>
      </View>
    </View>
    <View style={styles.userIcon}>
      <MaterialIcons name="person-outline" size={22} color={BRAND} />
    </View>
  </View>
);

export default function EducationScreen({ navigation }) {
  return (
    <MainLayout navigation={navigation} activeScreen="Education">
      <Header />
      <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Educación</Text>
        <Text style={styles.subtitle}>Aprende sobre reciclaje y sostenibilidad</Text>

        <View style={styles.banner}>
          <MaterialCommunityIcons name="book-open-variant" size={24} color="#fff" />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.bannerTitle}>Contenido educativo</Text>
            <Text style={styles.bannerText}>Explora nuestros artículos para aprender mejores prácticas de reciclaje</Text>
          </View>
        </View>

        {educationItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('EducationDetail', { item })}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + '22' }]}>
              <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardCategory}>{item.category}</Text>
              <Text style={styles.cardText}>{item.title}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </MainLayout>
  );
}

const tabs = [
  { icon: 'home',              label: 'Inicio',    screen: 'Home'      },
  { icon: 'plus',              label: 'Agregar',   screen: 'Recycle'   },
  { icon: 'trophy-outline',    label: 'Puntos',    screen: 'Home'      },
  { icon: 'book-open-variant', label: 'Educación', screen: 'Education' },
  { icon: 'chart-bar',         label: 'Dashboard', screen: 'Home'      },
];

const styles = StyleSheet.create({
  header: { flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#F3F4F6' },
  headerLeft: { flexDirection:'row', alignItems:'center' },
  headerTitle: { fontWeight:'700', fontSize:16 },
  headerSub: { fontSize:11, color:'#6B7280' },
  userIcon: { width:38, height:38, borderRadius:19, backgroundColor:'#F0FDF4', alignItems:'center', justifyContent:'center' },
  title: { fontSize:20, fontWeight:'700', marginBottom:4 },
  subtitle: { color:'#6B7280', marginBottom:10 },
  banner: { flexDirection:'row', backgroundColor:BRAND, padding:15, borderRadius:16, marginBottom:15, alignItems:'center' },
  bannerTitle: { color:'#fff', fontWeight:'700' },
  bannerText: { color:'#fff', fontSize:12 },
  card: { flexDirection:'row', backgroundColor:'#fff', padding:15, borderRadius:14, marginBottom:10, alignItems:'center', elevation:1 },
  iconBox: { width:40, height:40, borderRadius:10, justifyContent:'center', alignItems:'center', marginRight:10 },
  cardCategory: { fontSize:11, color:'#9CA3AF', marginBottom:1 },
  cardText: { fontSize:14, fontWeight:'600', color:'#1F2937' },
});
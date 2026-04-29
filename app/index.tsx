import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/portal.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(12, 12, 12, 0.8)', '#0C0C0C']}
          style={styles.overlay}
        >
          <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Animatable.View 
              animation="fadeInUp" 
              duration={1500} 
              style={styles.content}
            >
              <Text style={styles.subtitle}>BEM-VINDO AO UNIVERSO</Text>
              <Text style={styles.title}>Rick and Morty</Text>
              
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                  Explore todos os personagens, locais e episódios da série mais insana do multiverso.
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.button}
                onPress={() => router.push('/characters')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#97ce4c', '#5cad4a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>VER PERSONAGENS</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, { marginTop: 5 }]}
                onPress={() => router.push('/episodes')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#24282f', '#121417']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={[styles.buttonText, { color: '#97ce4c' }]}>VER EPISÓDIOS</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, { marginTop: 5 }]}
                onPress={() => router.push('/locations')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#24282f', '#121417']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={[styles.buttonText, { color: '#97ce4c' }]}>VER LOCALIZAÇÕES</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => {}}
              >
                <Text style={styles.secondaryButtonText}>SOBRE A API</Text>
              </TouchableOpacity>
            </Animatable.View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60,
    paddingHorizontal: 30,
  },
  content: {
    alignItems: 'center',
  },
  subtitle: {
    color: '#97ce4c',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(151, 206, 76, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  descriptionContainer: {
    marginBottom: 40,
  },
  description: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 10,
    shadowColor: '#97ce4c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#0C0C0C',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  secondaryButton: {
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#97ce4c',
    fontSize: 14,
    fontWeight: '600',
  },
});

import React from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Recipe } from '@/types/recipe';

export default function RecipeCard({
	recipe,
	onPress,
}: {
	recipe: Recipe['recipe'];
	onPress: () => void;
}) {
	const { theme } = useTheme();
	const scaleValue = new Animated.Value(1);

	const handlePressIn = () => {
		Animated.spring(scaleValue, {
			toValue: 0.97,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = () => {
		Animated.spring(scaleValue, {
			toValue: 1,
			friction: 5,
			useNativeDriver: true,
		}).start();
	};

	return (
		<Animated.View
			style={[styles.container, { transform: [{ scale: scaleValue }] }]}
		>
			<Pressable
				onPress={onPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				style={[styles.card, { backgroundColor: Colors[theme].surface }]}
			>
				<LinearGradient
					colors={[Colors[theme].tint + '20', Colors[theme].accent + '10']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.gradient}
				/>

				<View style={styles.content}>
					<View style={styles.header}>
						<ThemedText style={styles.title}>{recipe.title}</ThemedText>
						<MaterialCommunityIcons
							name="arrow-right-circle"
							size={28}
							color={Colors[theme].tint}
						/>
					</View>

					<ThemedText style={styles.description} numberOfLines={2}>
						{recipe.description}
					</ThemedText>

					<View style={styles.metaInfo}>
						{recipe.difficulty && (
							<View
								style={[
									styles.metaItem,
									{ backgroundColor: Colors[theme].background },
								]}
							>
								<MaterialCommunityIcons
									name="chef-hat"
									size={16}
									color={Colors[theme].tint}
								/>
								<ThemedText style={styles.metaText}>
									{recipe.difficulty}
								</ThemedText>
							</View>
						)}
						{recipe.prepTime && (
							<View
								style={[
									styles.metaItem,
									{ backgroundColor: Colors[theme].background },
								]}
							>
								<MaterialCommunityIcons
									name="clock-outline"
									size={16}
									color={Colors[theme].tint}
								/>
								<ThemedText style={styles.metaText}>
									{Number(recipe.prepTime) * 10} મિનિટ
								</ThemedText>
							</View>
						)}
					</View>

					<View style={styles.tags}>
						{recipe.tags.slice(0, 3).map((tag, index) => (
							<View
								key={index}
								style={[
									styles.tag,
									{ backgroundColor: Colors[theme].tint + '15' },
								]}
							>
								<ThemedText
									style={[styles.tagText, { color: Colors[theme].tint }]}
								>
									{tag}
								</ThemedText>
							</View>
						))}
					</View>
				</View>
			</Pressable>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16,
		marginVertical: 8,
	},
	card: {
		borderRadius: 24,
		overflow: 'hidden',
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
	},
	gradient: {
		position: 'absolute',
		width: '100%',
		height: '100%',
	},
	content: {
		padding: 20,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	title: {
		fontSize: 22,
		fontWeight: '700',
		flex: 1,
		marginRight: 16,
	},
	description: {
		fontSize: 15,
		marginBottom: 16,
		lineHeight: 22,
		opacity: 0.8,
	},
	metaInfo: {
		flexDirection: 'row',
		marginBottom: 16,
		gap: 12,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
		gap: 6,
	},
	metaText: {
		fontSize: 14,
		fontWeight: '500',
	},
	tags: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	tag: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
	},
	tagText: {
		fontSize: 13,
		fontWeight: '600',
	},
});

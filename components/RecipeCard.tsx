import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Recipe } from '../types/recipe';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
	recipe: Recipe['recipe'];
	onPress: () => void;
};

export default function RecipeCard({ recipe, onPress }: Props) {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [styles.card, pressed && styles.pressed]}
		>
			<View style={styles.header}>
				<Text style={styles.title}>{recipe.title}</Text>
				<MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
			</View>

			<Text style={styles.description} numberOfLines={2}>
				{recipe.description}
			</Text>

			<View style={styles.metaInfo}>
				{recipe.difficulty && (
					<View style={styles.metaItem}>
						<MaterialCommunityIcons name="chef-hat" size={16} color="#666" />
						<Text style={styles.metaText}>{recipe.difficulty}</Text>
					</View>
				)}
				{recipe.prepTime && (
					<View style={styles.metaItem}>
						<MaterialCommunityIcons
							name="clock-outline"
							size={16}
							color="#666"
						/>
						<Text style={styles.metaText}>{recipe.prepTime} મિનિટ</Text>
					</View>
				)}
				{recipe.servings && (
					<View style={styles.metaItem}>
						<MaterialCommunityIcons
							name="account-group"
							size={16}
							color="#666"
						/>
						<Text style={styles.metaText}>{recipe.servings} વ્યક્તિ</Text>
					</View>
				)}
			</View>

			<View style={styles.tags}>
				{recipe.tags.slice(0, 3).map((tag, index) => (
					<View key={index} style={styles.tag}>
						<Text style={styles.tagText}>{tag}</Text>
					</View>
				))}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: 'white',
		borderRadius: 16,
		padding: 16,
		marginVertical: 8,
		marginHorizontal: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	},
	pressed: {
		opacity: 0.9,
		transform: [{ scale: 0.98 }],
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: '700',
		color: '#333',
		flex: 1,
	},
	description: {
		fontSize: 15,
		color: '#666',
		marginBottom: 16,
		lineHeight: 22,
	},
	metaInfo: {
		flexDirection: 'row',
		marginBottom: 16,
		gap: 16,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	metaText: {
		fontSize: 14,
		color: '#666',
	},
	tags: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	tag: {
		backgroundColor: '#F3F4F6',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
	},
	tagText: {
		fontSize: 13,
		color: '#4B5563',
		fontWeight: '500',
	},
});

import React from 'react';
import {
	Modal,
	View,
	StyleSheet,
	ScrollView,
	Pressable,
	StatusBar,
	useWindowDimensions,
	Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Recipe } from '@/types/recipe';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

type Props = {
	recipe: Recipe['recipe'];
	visible: boolean;
	onClose: () => void;
	onDelete?: (title: string) => void; // id is now a number
};

export default function RecipeModal({
	recipe,
	visible,
	onClose,
	onDelete,
}: Props) {
	const { height } = useWindowDimensions();
	const { theme } = useTheme();

	const handleDelete = () => {
		// Use optional chaining and nullish coalescing
		const recipeId = recipe?.title ?? null;

		if (recipeId === null) {
			Alert.alert('Error', 'Cannot delete recipe without an ID.');
			return;
		}

		Alert.alert(
			'રેસીપી કાઢી નાખો',
			'શું તમે ખરેખર આ રેસીપી કાઢી નાખવા માંગો છો?',
			[
				{
					text: 'રદ કરો',
					style: 'cancel',
				},
				{
					text: 'કાઢી નાખો',
					style: 'destructive',
					onPress: () => {
						if (onDelete) {
							onDelete(recipeId); // Pass the ID
							onClose();
						}
					},
				},
			]
		);
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<BlurView intensity={95} style={StyleSheet.absoluteFill} />
			<View
				style={[styles.centeredView, { paddingTop: StatusBar.currentHeight }]}
			>
				<ThemedView style={[styles.modalView, { maxHeight: height * 0.9 }]}>
					<Pressable style={styles.closeButton} onPress={onClose} hitSlop={8}>
						<MaterialCommunityIcons
							name="close"
							size={24}
							color={Colors[theme].icon}
						/>
					</Pressable>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
					>
						<ThemedText type="title" style={styles.title}>
							{recipe.title}
						</ThemedText>
						<ThemedText style={styles.description}>
							{recipe.description}
						</ThemedText>

						<View style={styles.metaInfo}>
							{recipe.difficulty && (
								<View style={styles.metaItem}>
									<MaterialCommunityIcons
										name="chef-hat"
										size={18}
										color={Colors[theme].icon}
									/>
									<ThemedText style={styles.metaText}>
										{recipe.difficulty}
									</ThemedText>
								</View>
							)}
							{recipe.prepTime && (
								<View style={styles.metaItem}>
									<MaterialCommunityIcons
										name="clock-outline"
										size={18}
										color={Colors[theme].icon}
									/>
									<ThemedText style={styles.metaText}>
										{recipe.prepTime} મિનિટ
									</ThemedText>
								</View>
							)}
							{recipe.servings && (
								<View style={styles.metaItem}>
									<MaterialCommunityIcons
										name="account-group"
										size={18}
										color={Colors[theme].icon}
									/>
									<ThemedText style={styles.metaText}>
										{recipe.servings} વ્યક્તિ
									</ThemedText>
								</View>
							)}
						</View>

						<View style={styles.section}>
							<ThemedText type="subtitle" style={styles.sectionTitle}>
								સામગ્રી
							</ThemedText>
							{recipe.ingredients.map((ingredient, index) => (
								<View key={index} style={styles.ingredientItem}>
									<View
										style={[
											styles.bullet,
											{ backgroundColor: Colors[theme].icon },
										]}
									/>
									<ThemedText style={styles.ingredientText}>
										{ingredient}
									</ThemedText>
								</View>
							))}
						</View>

						<View style={styles.section}>
							<ThemedText type="subtitle" style={styles.sectionTitle}>
								રીત
							</ThemedText>
							{recipe.steps.map((step, index) => (
								<View key={index} style={styles.stepItem}>
									<ThemedText type="defaultSemiBold" style={styles.stepNumber}>
										{index + 1}
									</ThemedText>
									<ThemedText style={styles.stepText}>{step}</ThemedText>
								</View>
							))}
						</View>

						<View style={styles.tags}>
							{recipe.tags.map((tag, index) => (
								<View
									key={index}
									style={[
										styles.tag,
										{ backgroundColor: Colors[theme].background },
									]}
								>
									<ThemedText style={styles.tagText}>{tag}</ThemedText>
								</View>
							))}
						</View>
						{/* Only show delete button if onDelete prop exists and recipe has an id  */}
						{onDelete && recipe.title !== undefined && (
							<Pressable
								style={[
									styles.deleteButton,
									{ backgroundColor: Colors[theme].background },
								]}
								onPress={handleDelete}
							>
								<MaterialCommunityIcons
									name="delete"
									size={20}
									color="#FF4444"
								/>
								<ThemedText style={styles.deleteButtonText}>
									રેસીપી કાઢી નાખો
								</ThemedText>
							</Pressable>
						)}
					</ScrollView>
				</ThemedView>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	modalView: {
		backgroundColor: 'white',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 24,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -5 },
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 20,
	},
	scrollContent: {
		paddingTop: 20,
		paddingBottom: 40,
	},
	closeButton: {
		position: 'absolute',
		right: 20,
		top: 20,
		zIndex: 1,
		backgroundColor: '#F3F4F6',
		borderRadius: 20,
		padding: 8,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#111',
		marginBottom: 12,
		marginTop: 24,
	},
	description: {
		fontSize: 16,
		color: '#666',
		marginBottom: 24,
		lineHeight: 24,
	},
	metaInfo: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
		marginBottom: 32,
		paddingBottom: 24,
		borderBottomWidth: 1,
		borderBottomColor: '#F3F4F6',
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	metaText: {
		fontSize: 15,
		color: '#666',
	},
	section: {
		marginBottom: 32,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#111',
		marginBottom: 16,
	},
	ingredientItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
		gap: 12,
	},
	bullet: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: '#666',
	},
	ingredientText: {
		fontSize: 16,
		color: '#333',
		flex: 1,
		lineHeight: 24,
	},
	stepItem: {
		flexDirection: 'row',
		marginBottom: 16,
		gap: 16,
	},
	stepNumber: {
		fontSize: 16,
		fontWeight: '600',
		color: '#666',
		width: 24,
		textAlign: 'center',
	},
	stepText: {
		fontSize: 16,
		color: '#333',
		flex: 1,
		lineHeight: 24,
	},
	tags: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginTop: 8,
	},
	tag: {
		backgroundColor: '#F3F4F6',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
	},
	tagText: {
		fontSize: 14,
		color: '#4B5563',
	},
	deleteButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 32,
		padding: 12,
		backgroundColor: '#FEE2E2',
		borderRadius: 8,
		gap: 8,
	},
	deleteButtonText: {
		color: '#FF4444',
		fontSize: 16,
		fontWeight: '600',
	},
});

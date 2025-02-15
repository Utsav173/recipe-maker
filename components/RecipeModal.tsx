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
	Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Recipe } from '@/types/recipe';

export default function RecipeModal({
	recipe,
	visible,
	onClose,
	onDelete,
}: {
	recipe: Recipe['recipe'];
	visible: boolean;
	onClose: () => void;
	onDelete?: (title: string) => void;
}) {
	const { height } = useWindowDimensions();
	const { theme } = useTheme();
	const slideAnim = React.useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		if (visible) {
			Animated.spring(slideAnim, {
				toValue: 1,
				tension: 65,
				friction: 11,
				useNativeDriver: true,
			}).start();
		}
	}, [visible]);

	const handleDelete = () => {
		Alert.alert(
			'રેસીપી કાઢી નાખો',
			'શું તમે ખરેખર આ રેસીપી કાઢી નાખવા માંગો છો?',
			[
				{ text: 'રદ કરો', style: 'cancel' },
				{
					text: 'કાઢી નાખો',
					style: 'destructive',
					onPress: () => {
						onDelete?.(recipe.title);
						onClose();
					},
				},
			]
		);
	};

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<BlurView intensity={85} style={StyleSheet.absoluteFill} tint="dark" />
			<View
				style={[styles.centeredView, { paddingTop: StatusBar.currentHeight }]}
			>
				<Animated.View
					style={[
						styles.modalView,
						{
							maxHeight: height * 0.9,
							backgroundColor: Colors[theme].background,
							transform: [
								{
									translateY: slideAnim.interpolate({
										inputRange: [0, 1],
										outputRange: [300, 0],
									}),
								},
							],
						},
					]}
				>
					<LinearGradient
						colors={[Colors[theme].tint + '10', Colors[theme].accent + '05']}
						style={styles.headerGradient}
					/>

					<Pressable
						style={[styles.closeButton]}
						onPress={onClose}
						hitSlop={12}
					>
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

						<View style={styles.metaInfo}>
							{recipe.difficulty && (
								<View
									style={[
										styles.metaItem,
										{ backgroundColor: Colors[theme].surface },
									]}
								>
									<MaterialCommunityIcons
										name="chef-hat"
										size={18}
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
										{ backgroundColor: Colors[theme].surface },
									]}
								>
									<MaterialCommunityIcons
										name="clock-outline"
										size={18}
										color={Colors[theme].tint}
									/>
									<ThemedText style={styles.metaText}>
										{recipe.prepTime} મિનિટ
									</ThemedText>
								</View>
							)}
						</View>

						<ThemedText style={styles.description}>
							{recipe.description}
						</ThemedText>

						<View style={styles.section}>
							<ThemedText type="subtitle" style={styles.sectionTitle}>
								સામગ્રી
							</ThemedText>
							{recipe.ingredients.map((ingredient, index) => (
								<View key={index} style={styles.ingredientItem}>
									<View
										style={[
											styles.bullet,
											{ backgroundColor: Colors[theme].tint },
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
									<View
										style={[
											styles.stepNumber,
											{ backgroundColor: Colors[theme].surface },
										]}
									>
										<ThemedText
											style={[
												styles.stepNumberText,
												{ color: Colors[theme].tint },
											]}
										>
											{index + 1}
										</ThemedText>
									</View>
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

						{onDelete && (
							<Pressable style={styles.deleteButton} onPress={handleDelete}>
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
				</Animated.View>
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
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -5 },
		shadowOpacity: 0.25,
		shadowRadius: 12,
		elevation: 24,
	},
	headerGradient: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 200,
	},
	scrollContent: {
		padding: 24,
		paddingTop: 12,
		paddingBottom: 40,
	},
	closeButton: {
		position: 'absolute',
		right: 20,
		top: 20,
		zIndex: 1,
		padding: 8,
		borderRadius: 20,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		marginTop: 32,
		marginBottom: 20,
	},
	description: {
		fontSize: 16,
		marginVertical: 24,
		lineHeight: 24,
		opacity: 0.9,
	},
	metaInfo: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 16,
		gap: 8,
	},
	metaText: {
		fontSize: 15,
		fontWeight: '500',
	},
	section: {
		marginTop: 32,
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: '600',
		marginBottom: 20,
	},
	ingredientItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
		gap: 12,
	},
	bullet: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	ingredientText: {
		fontSize: 16,
		flex: 1,
		lineHeight: 24,
	},
	stepItem: {
		flexDirection: 'row',
		marginBottom: 24,
		gap: 16,
	},
	stepNumber: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	stepNumberText: {
		fontSize: 16,
		fontWeight: '600',
	},
	stepText: {
		fontSize: 16,
		flex: 1,
		lineHeight: 24,
	},
	tags: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginTop: 32,
	},
	tag: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 20,
	},
	tagText: {
		fontSize: 14,
		fontWeight: '600',
	},
	deleteButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 40,
		padding: 16,
		backgroundColor: '#FFE5E5',
		borderRadius: 12,
		gap: 8,
	},
	deleteButtonText: {
		color: '#FF4444',
		fontSize: 16,
		fontWeight: '600',
	},
});

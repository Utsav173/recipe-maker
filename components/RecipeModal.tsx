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
	Linking,
	FlatList,
	Image,
	ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Recipe } from '@/types/recipe';

const SPACING = {
	xs: 8,
	sm: 12,
	md: 16,
	lg: 24,
	xl: 32,
};

const RADIUS = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	xxl: 32,
};

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
	const [youtubeVideos, setYoutubeVideos] = React.useState<any[]>([]);
	const [videoLoading, setVideoLoading] = React.useState(false);

	const YOUTUBE_API_KEY = 'AIzaSyBZx8wFp74nwQauvXBCpIN1SUZKQhs_LCU';

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

	const handleSuggestVideosNew = () => {
		const searchQuery = `${recipe.title} recipe`;
		const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
			searchQuery
		)}`;
		Linking.openURL(youtubeSearchUrl);
	};

	const fetchYoutubeVideos = async (recipeTitle: string) => {
		setVideoLoading(true);
		setYoutubeVideos([]);
		try {
			const searchQuery = `${recipeTitle} recipe gujarati`;
			const response = await fetch(
				`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(
					searchQuery
				)}&key=${YOUTUBE_API_KEY}&type=video`
			);
			const data = await response.json();
			if (data.items) {
				setYoutubeVideos(data.items);
			} else {
				setYoutubeVideos([]);
			}
		} catch (error) {
			console.error('Error fetching YouTube videos:', error);
			Alert.alert('Error', 'Failed to load YouTube videos.');
			setYoutubeVideos([]);
		} finally {
			setVideoLoading(false);
		}
	};

	const handleSuggestVideos = () => {
		fetchYoutubeVideos(recipe.title);
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
						colors={[Colors[theme].tint + '15', Colors[theme].background]}
						style={styles.headerGradient}
					/>

					<Pressable
						style={[styles.closeButton]}
						onPress={onClose}
						hitSlop={SPACING.md}
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
						{youtubeVideos.length > 0 ? null : (
							<Pressable
								style={[
									styles.actionButton,
									{ backgroundColor: Colors[theme].tint },
								]}
								onPress={handleSuggestVideos}
							>
								<MaterialCommunityIcons
									name="youtube"
									size={20}
									color={Colors[theme].background}
								/>
								<ThemedText style={styles.actionButtonText}>
									સૂચવેલ YouTube વિડિઓઝ
								</ThemedText>
							</Pressable>
						)}

						{videoLoading ? (
							<ActivityIndicator
								size="small"
								color={Colors[theme].tint}
								style={styles.loader}
							/>
						) : (
							<View style={styles.videoSection}>
								{youtubeVideos.length > 0 ? (
									<FlatList
										horizontal
										data={youtubeVideos}
										keyExtractor={(item) => item.id.videoId}
										renderItem={({ item }) => (
											<Pressable
												style={[
													styles.videoCard,
													{ backgroundColor: Colors[theme].surface },
												]}
												onPress={() =>
													Linking.openURL(
														`https://www.youtube.com/watch?v=${item.id.videoId}`
													)
												}
											>
												<Image
													source={{ uri: item.snippet.thumbnails.medium.url }}
													style={styles.videoThumbnail}
												/>
												<View style={styles.videoInfo}>
													<ThemedText
														style={styles.videoTitle}
														numberOfLines={2}
													>
														{item.snippet.title}
													</ThemedText>
													<ThemedText
														style={styles.channelName}
														numberOfLines={1}
													>
														{item.snippet.channelTitle}
													</ThemedText>
												</View>
											</Pressable>
										)}
										showsHorizontalScrollIndicator={false}
										contentContainerStyle={styles.videoList}
										decelerationRate="fast"
										snapToAlignment="start"
										snapToInterval={280}
									/>
								) : null}
							</View>
						)}

						{onDelete && (
							<Pressable
								style={[styles.deleteButton, { backgroundColor: '#FFE5E5' }]}
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
		borderTopLeftRadius: RADIUS.xxl,
		borderTopRightRadius: RADIUS.xxl,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -5 },
		shadowOpacity: 0.25,
		shadowRadius: RADIUS.md,
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
		padding: SPACING.lg,
		paddingTop: SPACING.sm,
		paddingBottom: SPACING.xl,
	},
	closeButton: {
		position: 'absolute',
		right: SPACING.lg,
		top: SPACING.lg,
		zIndex: 1,
		padding: SPACING.xs,
		borderRadius: RADIUS.xl,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		marginTop: SPACING.xl,
		marginBottom: SPACING.lg,
	},
	description: {
		fontSize: 16,
		marginVertical: SPACING.lg,
		lineHeight: 24,
		opacity: 0.9,
	},
	metaInfo: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: SPACING.sm,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: SPACING.md,
		paddingVertical: SPACING.xs,
		borderRadius: RADIUS.lg,
		gap: SPACING.xs,
	},
	metaText: {
		fontSize: 15,
		fontWeight: '500',
	},
	section: {
		marginTop: SPACING.xl,
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: '600',
		marginBottom: SPACING.lg,
	},
	ingredientItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: SPACING.md,
		gap: SPACING.sm,
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
		marginBottom: SPACING.lg,
		gap: SPACING.md,
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
		gap: SPACING.xs,
		marginTop: SPACING.xl,
	},
	tag: {
		paddingHorizontal: SPACING.md,
		paddingVertical: SPACING.xs,
		borderRadius: RADIUS.xl,
	},
	tagText: {
		fontSize: 14,
		fontWeight: '600',
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: SPACING.xl,
		padding: SPACING.md,
		borderRadius: RADIUS.md,
		gap: SPACING.xs,
	},
	actionButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	videoSection: {
		marginTop: SPACING.xl,
		marginHorizontal: -SPACING.lg,
	},
	videoList: {
		paddingHorizontal: SPACING.lg,
		gap: SPACING.md,
	},
	videoCard: {
		width: 300,
		borderRadius: RADIUS.lg,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: RADIUS.md,
		elevation: 5,
		transform: [{ scale: 0.98 }],
	},
	videoCardActive: {
		transform: [{ scale: 1 }],
	},
	videoThumbnail: {
		width: '100%',
		height: 169,
		resizeMode: 'cover',
	},
	playButton: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: [{ translateX: -25 }, { translateY: -25 }],
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: 'rgba(0,0,0,0.7)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	videoInfo: {
		padding: SPACING.md,
	},
	videoTitle: {
		fontSize: 15,
		fontWeight: '600',
		marginBottom: SPACING.xs,
		lineHeight: 20,
	},
	channelName: {
		fontSize: 13,
		opacity: 0.8,
		flexDirection: 'row',
		alignItems: 'center',
		gap: SPACING.xs,
	},
	viewCount: {
		fontSize: 13,
		opacity: 0.6,
		marginTop: SPACING.xs,
	},
	loader: {
		marginTop: SPACING.lg,
	},
	emptyText: {
		textAlign: 'center',
		opacity: 0.7,
		marginTop: SPACING.md,
	},
	deleteButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: SPACING.sm,
		padding: SPACING.md,
		borderRadius: RADIUS.md,
		gap: SPACING.xs,
	},
	deleteButtonText: {
		color: '#FF4444',
		fontSize: 16,
		fontWeight: '600',
	},
});

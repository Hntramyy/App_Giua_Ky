import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fontSize, iconTile, radius, spacing } from '../theme';

interface Props {
  title: string;
}

// Compact header of the main screen: logo, title, avatar
export default function AppHeader({ title }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.logo}>
        <Icon name="restaurant" size={18} color={colors.white} />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.avatar}>
        <Icon name="person-outline" size={18} color={colors.primaryDark} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  logo: {
    ...iconTile,
    backgroundColor: colors.primary,
  },
  title: {
    flex: 1,
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

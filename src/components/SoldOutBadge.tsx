import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

export default function SoldOutBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>Hết món</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.dangerSoft,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.danger,
  },
});

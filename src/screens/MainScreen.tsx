import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import BottomTabBar from '../components/BottomTabBar';
import { TABS } from '../navigation/tabs';
import { ScreenProps, TabKey } from '../navigation/types';
import { colors } from '../theme';
import MenuTab from './tabs/MenuTab';
import TablesTab from './tabs/TablesTab';

// Home screen: header + current tab + hand-made bottom menu
export default function MainScreen({ route }: ScreenProps<'Main'>) {
  const requestedTab = route.params?.tab;
  const [activeTab, setActiveTab] = useState<TabKey>(requestedTab ?? 'tables');

  // Other screens can jump back to a given tab (e.g. after payment)
  useEffect(() => {
    if (requestedTab) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  const current = TABS.find(tab => tab.key === activeTab) ?? TABS[0];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <AppHeader title={current.label} />
      <View style={styles.content}>
        {activeTab === 'tables' ? <TablesTab /> : <MenuTab />}
      </View>
      <BottomTabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});

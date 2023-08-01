import React, {Fragment, useCallback, useContext, useState} from 'react';
import {Animated, useWindowDimensions} from 'react-native';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {TouchableOpacity, Text} from 'react-native';
import {gutterCompact, gutterNormal, typography} from '../../lib/styles';
import {Settings, updateSetting} from '../../services/settings';
import {unslug} from '../../services/unslug';
import {ThemeContext} from '../../services/theme-context';
import {ThemedText} from '../../lib/themed-text';

const MODAL_HEIGHT = 240;
const MODAL_WIDTH = 300;

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: MODAL_WIDTH,
    height: MODAL_HEIGHT,
    borderRadius: 8,
  },
  backdrop: {
    opacity: 0.3,
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalContainer: {
    padding: gutterNormal,
  },
  titleContainer: {
    paddingBottom: gutterCompact,
  },
  listItem: {
    paddingVertical: gutterCompact,
  },
  listOption: {
    paddingLeft: gutterNormal,
    padding: gutterCompact,
    flexDirection: 'row',
  },
});

export function AppSettings() {
  const {height, width} = useWindowDimensions();
  const [isShowingModal, setIsShowingModal] = useState(false);

  const {theme, card, border} = useContext(ThemeContext);

  const handleThemeChange = useCallback((newTheme: Settings['theme']) => {
    updateSetting({theme: newTheme});
  }, []);

  return (
    <Fragment>
      <TouchableOpacity onPress={() => setIsShowingModal(true)}>
        <Text>⚙</Text>
      </TouchableOpacity>
      {isShowingModal && (
        <Fragment>
          <Modal
            transparent
            animationType="fade"
            style={styles.modal}
            onRequestClose={() => setIsShowingModal(false)}>
            <Pressable
              style={styles.backdrop}
              onPress={() => setIsShowingModal(false)}
            />
            <View
              style={
                (styles.centeredView,
                {
                  top: height / 2 - MODAL_HEIGHT / 2,
                  left: width / 2 - MODAL_WIDTH / 2,
                })
              }>
              <Animated.View style={[styles.modal, {backgroundColor: card}]}>
                <View style={[styles.modalContainer]}>
                  <View style={styles.titleContainer}>
                    <ThemedText style={typography.title}>Settings</ThemedText>
                  </View>
                  <Animated.View
                    style={[styles.listItem, {borderColor: border}]}>
                    <ThemedText style={typography.bodyBold}>Theme</ThemedText>
                    {(['system', 'light', 'dark'] as Settings['theme'][]).map(
                      (themeOption: Settings['theme']) => {
                        return (
                          <TouchableOpacity
                            onPress={() => handleThemeChange(themeOption)}
                            style={styles.listOption}
                            key={themeOption}>
                            <ThemedText
                              style={[
                                theme === themeOption
                                  ? typography.bodyBold
                                  : typography.body,
                              ]}>
                              {unslug(themeOption)}
                            </ThemedText>
                          </TouchableOpacity>
                        );
                      },
                    )}
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.listItem,
                      {
                        borderTopColor: border,
                        borderTopWidth: StyleSheet.hairlineWidth,
                      },
                    ]}>
                    <ThemedText style={typography.body}>
                      {/* TODO: Dynamic version number */}
                      Version: 1.0.1
                    </ThemedText>
                  </Animated.View>
                </View>
              </Animated.View>
            </View>
          </Modal>
        </Fragment>
      )}
    </Fragment>
  );
}

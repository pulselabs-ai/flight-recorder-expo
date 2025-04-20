import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TodoProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function Todo({ id, text, completed, onToggle, onDelete }: TodoProps) {
  return (
    <View style={styles.todoContainer}>
      <TouchableOpacity
        style={styles.todoCheckbox}
        onPress={() => onToggle(id)}
      >
        <Ionicons
          name={completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={completed ? '#4CAF50' : '#666'}
        />
      </TouchableOpacity>
      <Text style={[styles.todoText, completed && styles.completedText]}>
        {text}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(id)}
      >
        <Ionicons name="trash-outline" size={24} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  todoCheckbox: {
    marginRight: 12,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    marginLeft: 12,
  },
}); 
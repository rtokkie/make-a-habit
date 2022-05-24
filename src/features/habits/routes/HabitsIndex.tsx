import {
  Box,
  CircularProgress,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { BiDotsVertical, BiShocked } from 'react-icons/bi';

import { Layout } from '@/components/Layout';
import { Link } from '@/components/Link';
import { HabitDoc } from '@/fire/docs';

import { useHabits } from '../hooks/useHabits';

type HabitItemProps = { habit: HabitDoc; onGiveUp: () => void };

const HabitItem: FC<HabitItemProps> = ({ habit, onGiveUp }) => {
  return (
    <HStack spacing={{ base: '2', md: '4' }}>
      <CircularProgress
        size="64px"
        color={habit.hasDoneToday ? 'green.400' : 'gray.400'}
        value={habit.progressPercent}
      />

      <Box flex="1">
        <Link to={`/app/habits/${habit.id}`}>
          <Heading size="sm" whiteSpace="pre-wrap">
            {habit.content}
          </Heading>
          <Box fontSize="sm"> {habit.formattedPeriod}</Box>
        </Link>
      </Box>

      <Box>
        <Menu>
          <MenuButton color="gray.500">
            <BiDotsVertical fontSize="20px" />
          </MenuButton>

          <MenuList>
            <MenuItem onClick={onGiveUp}>
              <HStack>
                <BiShocked fontSize="20px" />
                <Box>Give Up ..</Box>
              </HStack>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </HStack>
  );
};

export const HabitsIndex: FC = () => {
  const { loading, habits, giveUp } = useHabits();

  return (
    <Layout title="Habits">
      <Stack py="4" spacing="4">
        {!loading && habits.length === 0 && (
          <Link to="/app/habits/new" alignSelf="center" color="green.400" fontWeight="bold">
            Create a New habit
          </Link>
        )}
        {habits.map((h) => (
          <HabitItem key={h.id} habit={h} onGiveUp={() => giveUp(h)} />
        ))}
      </Stack>
    </Layout>
  );
};
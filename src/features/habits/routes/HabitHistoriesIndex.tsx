import { Box, Heading, Stack } from '@chakra-ui/react';
import { format } from 'date-fns';
import { FC } from 'react';
import { BiCheck } from 'react-icons/bi';
import { useParams } from 'react-router-dom';

import { Layout } from '@/components/Layout';
import { HabitRecordDoc } from '@/fire/docs';
import { assertDefined } from '@/utils/assert-defined';

import { useHabitHistoriesIndex } from '../hooks';

const formattedDay = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];

type HabitRecordItemProps = { habitRecord: HabitRecordDoc };

const HabitRecordItem: FC<HabitRecordItemProps> = ({ habitRecord }) => {
  return (
    <Stack direction="row" spacing={{ base: '2', md: '4' }}>
      <Box
        h="14"
        w="14"
        rounded="full"
        bg={habitRecord.done ? 'primary.main' : 'primary.100'}
        flexShrink="0"
        position="relative"
      >
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
          <BiCheck fontSize="36px" color="white" />
        </Box>
      </Box>
      <Box>
        <Box fontSize="sm" color="gray.500">
          {format(habitRecord.createdAt.toDate(), 'MM/dd')}{' '}
          {formattedDay[habitRecord.createdAt.toDate().getDay()]}
        </Box>
        <Box fontSize="sm" whiteSpace="pre-wrap">
          {habitRecord.comment}
        </Box>
      </Box>
    </Stack>
  );
};

export const HabitHistoriesIndex: FC = () => {
  const { habitId } = useParams();
  assertDefined(habitId);

  const { habit, habitRecords } = useHabitHistoriesIndex(habitId);

  return (
    <Layout title="Histories" backTo="/app/habits/all">
      {habit && habitRecords ? (
        <Stack py="4" spacing="4">
          <Heading size="sm" textAlign="center" whiteSpace="pre-wrap">
            {habit.content}
          </Heading>

          <Stack spacing="4">
            {habitRecords.map((h) => (
              <HabitRecordItem key={h.id} habitRecord={h} />
            ))}
          </Stack>
        </Stack>
      ) : null}
    </Layout>
  );
};

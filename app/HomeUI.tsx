import Link from 'next/link';

interface HomeUIProps {
  user: any;
  buttonStage1: 'check' | 'claim' | 'claimed';
  buttonStage2: 'check' | 'claim' | 'claimed';
  isLoading: boolean;
  notification: string;
  handleButtonClick1: () => void;
  handleButtonClick2: () => void;
  handleClaim1: () => void;
  handleClaim2: () => void;
}

export default function HomeUI({
  user,
  buttonStage1,
  buttonStage2,
  isLoading,
  notification,
  handleButtonClick1,
  handleButtonClick2,
  handleClaim1,
  handleClaim2
}: HomeUIProps) {
  return (
    <div className="bg-gray-700 flex flex-col items-center justify-between min-h-screen">
      {/* Top Section */}
      <div className="bg-white w-full flex flex-col items-center justify-start flex-1">
        <div className="flex flex-col items-center mt-10 w-full">
          {/* Profile Image */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-700 rounded-full overflow-hidden">
            <img
              alt="Profile Image"
              className="w-full h-full object-cover"
              src="https://storage.googleapis.com/a1aa/image/WYUNkYgR7iK2G52eFZ7kI72EXNou8j14cNEpcoYEfssr2QnTA.jpg"
            />
          </div>
          {/* User Points */}
          <p className="mt-4 text-lg sm:text-xl md:text-2xl font-bold mb-12">{user.points.toLocaleString()} PixelDogs</p>
        </div>

        {/* Daily Tasks */}
        <div className="bg-gray-700 w-full max-w-md p-4 rounded-t-3xl">
          <div className="bg-gray-200 text-center py-2 rounded-full mb-4 w-3/5 sm:w-2/5 mx-auto">
            <p className="font-bold text-sm sm:text-base">Daily Tasks..!</p>
          </div>

          {/* Task 1 */}
          <div className="flex justify-between items-center bg-gray-200 p-3 rounded-lg mb-3 w-full">
            <p className="font-bold text-sm sm:text-base">Follow Our Youtube!</p>
            <button
              onClick={() => {
                if (buttonStage1 === 'check') {
                  handleButtonClick1();
                } else if (buttonStage1 === 'claim') {
                  handleClaim1();
                }
              }}
              className={`bg-gray-700 text-white px-3 sm:px-4 py-1 rounded-full ${
                isLoading ? 'cursor-not-allowed' : ''
              }`}
              disabled={buttonStage1 === 'claimed' || isLoading}
            >
              {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>

          {/* Task 2 */}
          <div className="flex justify-between items-center bg-gray-200 p-3 rounded-lg w-full">
            <p className="font-bold text-sm sm:text-base">Follow Our Twitter!</p>
            <button
              onClick={() => {
                if (buttonStage2 === 'check') {
                  handleButtonClick2();
                } else if (buttonStage2 === 'claim') {
                  handleClaim2();
                }
              }}
              className={`bg-gray-700 text-white px-3 sm:px-4 py-1 rounded-full ${
                buttonStage2 === 'claimed' ? 'cursor-not-allowed' : ''
              }`}
              disabled={buttonStage2 === 'claimed'}
            >
              {buttonStage2 === 'check' ? 'Check' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>

          {/* Notification */}
          {notification && (
            <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
              {notification}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-800 w-full py-4 flex justify-around items-center text-white">
        <Link href="/home" className="flex flex-col items-center">
          <i className="fas fa-home text-xl"></i>
          <p className="text-xs sm:text-sm">Home</p>
        </Link>
        <Link href="/friends" className="flex flex-col items-center">
          <i className="fas fa-users text-xl"></i>
          <p className="text-xs sm:text-sm">Friends</p>
        </Link>
        <Link href="/tasks" className="flex flex-col items-center">
          <i className="fas fa-tasks text-xl"></i>
          <p className="text-xs sm:text-sm">Tasks</p>
        </Link>
      </div>
    </div>
  );
}

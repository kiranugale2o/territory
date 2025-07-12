import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';

type StatusType = 'Accepted' | 'Declined' | 'Pending';

interface MeetingCardProps {
  status: StatusType;
  timeAgo: string;
  date: string;
  time: string;
  location: string;
  person: string;
}

const statusStyles: Record<StatusType, {textColor: string; dotColor: string}> =
  {
    Accepted: {textColor: '#0078DB', dotColor: '#21BE79'},
    Declined: {textColor: '#FF3B30', dotColor: '#FF3B30'},
    Pending: {textColor: '#FFC107', dotColor: '#FFC107'},
  };

const MeetingCard: React.FC<MeetingCardProps> = ({
  status,
  timeAgo,
  date,
  time,
  location,
  person,
}) => {
  const {textColor, dotColor} = statusStyles[status];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.statusRow}>
          <View style={styles.iconCircle}>
            {status === 'Accepted' ? (
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 0C15.1826 0 18.2348 1.26428 20.4853 3.51472C22.7357 5.76515 24 8.8174 24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24C8.8174 24 5.76515 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12C0 8.8174 1.26428 5.76515 3.51472 3.51472C5.76515 1.26428 8.8174 0 12 0ZM10.5051 14.3674L7.83943 11.7C7.74386 11.6044 7.63041 11.5286 7.50555 11.4769C7.38069 11.4252 7.24686 11.3986 7.11171 11.3986C6.97657 11.3986 6.84274 11.4252 6.71788 11.4769C6.59302 11.5286 6.47956 11.6044 6.384 11.7C6.191 11.893 6.08257 12.1548 6.08257 12.4277C6.08257 12.7007 6.191 12.9624 6.384 13.1554L9.77829 16.5497C9.87358 16.6458 9.98694 16.722 10.1118 16.774C10.2367 16.826 10.3707 16.8528 10.506 16.8528C10.6413 16.8528 10.7753 16.826 10.9002 16.774C11.0251 16.722 11.1384 16.6458 11.2337 16.5497L18.2623 9.51943C18.3591 9.42426 18.4362 9.31086 18.489 9.18577C18.5418 9.06068 18.5693 8.92637 18.5699 8.79059C18.5705 8.65482 18.5443 8.52026 18.4926 8.39468C18.441 8.26911 18.365 8.15499 18.2691 8.05893C18.1731 7.96286 18.0591 7.88675 17.9336 7.83497C17.8081 7.78319 17.6735 7.75677 17.5378 7.75725C17.402 7.75772 17.2677 7.78507 17.1425 7.83771C17.0173 7.89036 16.9039 7.96727 16.8086 8.064L10.5051 14.3674Z"
                  fill="#21BE79"
                />
              </Svg>
            ) : (
              <>
                {status === 'Pending' ? (
                  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 0C18.6276 0 24 5.3724 24 12C24 18.6276 18.6276 24 12 24C5.3724 24 0 18.6276 0 12C0 5.3724 5.3724 0 12 0ZM12 4.8C11.6817 4.8 11.3765 4.92643 11.1515 5.15147C10.9264 5.37652 10.8 5.68174 10.8 6V12C10.8001 12.3182 10.9265 12.6234 11.1516 12.8484L14.7516 16.4484C14.9779 16.667 15.281 16.7879 15.5957 16.7852C15.9103 16.7825 16.2113 16.6563 16.4338 16.4338C16.6563 16.2113 16.7825 15.9103 16.7852 15.5957C16.7879 15.281 16.667 14.9779 16.4484 14.7516L13.2 11.5032V6C13.2 5.68174 13.0736 5.37652 12.8485 5.15147C12.6235 4.92643 12.3183 4.8 12 4.8Z"
                      fill="#EAB308"
                    />
                  </Svg>
                ) : (
                  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 0C5.31429 0 0 5.31429 0 12C0 18.6857 5.31429 24 12 24C18.6857 24 24 18.6857 24 12C24 5.31429 18.6857 0 12 0ZM16.6286 18L12 13.3714L7.37143 18L6 16.6286L10.6286 12L6 7.37143L7.37143 6L12 10.6286L16.6286 6L18 7.37143L13.3714 12L18 16.6286L16.6286 18Z"
                      fill="#FF4646"
                    />
                  </Svg>
                )}
              </>
            )}
          </View>
          <View style={styles.statusText}>
            <Text style={[styles.status, {color: textColor}]}>
              Request {status}
            </Text>
            <Text style={[styles.timeAgo]}>{timeAgo}</Text>
          </View>
        </View>
        <Text style={styles.message}>
          Your meeting with {person} has been successfully scheduled.
        </Text>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{time}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{location}</Text>
        </View>
      </View>
    </View>
  );
};

export default MeetingCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 16,
    gap: 16,
    width: '95%',
    marginInline: 'auto',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
  },
  headerSection: {
    gap: 16,
    width: 326,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    flexDirection: 'column',
    gap: 4,
  },
  status: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 19,
  },
  timeAgo: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.4)',
  },
  message: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  infoSection: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  label: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  value: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000',
  },
});

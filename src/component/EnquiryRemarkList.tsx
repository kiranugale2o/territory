import React from 'react';
import {View, Text, TextInput} from 'react-native';
interface Remark {
  followupid: number;
  enquirerid: number;
  visitdate: string; // ISO 8601 date string
  dealamount: number | null;
  remark: string;
  status: string;
  changestatus: number;
  paymenttype: string | null;
  paymentimage: string | null;
  updated_at: string; // ISO 8601 date string
  created_at: string; // ISO 8601 date string
}

interface Props {
  remarkList: Remark[];
}
export const getStatusStyle = (
  status: string,
): {backgroundColor?: string; color: string} => {
  switch (status) {
    case 'New':
      return {backgroundColor: '#EAFBF1', color: '#0078DB'};
    case 'Visit Scheduled':
      return {backgroundColor: '#E9F2FF', color: '#0068FF'};
    case 'Token':
      return {backgroundColor: '#FFF8DD', color: '#FFCA00'};
    case 'Cancelled':
      return {backgroundColor: '#FFEAEA', color: '#ff2323'};
    case 'Follow Up':
      return {backgroundColor: '#F4F0FB', color: '#5D00FF'};
    default:
      return {color: '#000000'};
  }
};

const EnquiryRemarkList: React.FC<Props> = ({remarkList}) => {
  return (
    <View style={{width: '100%'}}>
      <Text style={{fontWeight: '600', fontSize: 16, marginTop: 24}}>
        Enquiry Remark List
      </Text>

      <View style={{marginTop: 8, flexDirection: 'column'}}>
        {remarkList.length > 0 ? (
          remarkList.map((remark, index) => {
            const statusStyle = getStatusStyle(remark.status);
            const date = new Date(remark.created_at).toLocaleDateString(
              'en-GB',
              {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              },
            );

            return (
              <View key={index} style={{width: '100%', marginTop: 16}}>
                <Text
                  style={{
                    fontSize: 14,
                    // fontWeight: '500',
                    color: '#00000066',
                    marginBottom: 4,
                  }}>
                  <Text
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color,
                    }}>
                    {date} - {remark.status}
                  </Text>
                </Text>

                <View
                  style={[
                    //  styles.container2,
                    {
                      backgroundColor: `${`#0078DB`}20`,
                      borderRadius: 20,
                      width: 'auto',
                      padding: 15,
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        fontSize: 14,
                        fontWeight: '500',
                        color: `#0078DB`,
                        width: '100%',
                      },
                    ]}>
                    {remark.remark}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View
            style={[
              //  styles.container2,
              {
                backgroundColor: `${`#0078DB`}20`,
                borderRadius: 20,
                width: 'auto',
                padding: 15,
              },
            ]}>
            <Text
              style={[
                {
                  fontSize: 14,
                  fontWeight: '500',
                  color: `#0078DB`,
                  width: '100%',
                },
              ]}>
              No Remark Found
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default EnquiryRemarkList;

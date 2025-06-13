import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userName?: string; // 환영할 사용자 이름 (선택 사항)
  serviceName?: string; // 서비스 이름 (예: "별자리 우체통")
  serviceLogoUrl?: string; // 서비스 로고 이미지 URL
  starIconUrl?: string; // 별 캐릭터 아이콘 URL
  appDashboardUrl: string; // 서비스 대시보드 또는 메인 페이지 URL
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  border: '1px solid #e6ebf1',
};

const box = {
  padding: '0 48px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  color: '#3c4043',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '24px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#5A67D8', // 서비스 컨셉에 맞는 보라색 계열
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '10px 20px',
  margin: '20px auto 0',
  width: 'fit-content',
};

const link = {
  color: '#5A67D8',
  textDecoration: 'underline',
};

export const WelcomeEmail = ({
  userName = '고민이 있는 사람',
  serviceName = '별자리 우체통',
  serviceLogoUrl,
  starIconUrl = 'https://xcojeabbrrvkkfvwduoj.supabase.co/storage/v1/object/public/channel-imgs//star-char.png', // 기본 별 아이콘 URL (예시)
  appDashboardUrl,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>✨ ${serviceName}에 오신 것을 환영합니다! 당신의 별이 빛나기 시작했어요.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          {serviceLogoUrl && (
            <Img
              src={serviceLogoUrl}
              width="60"
              height="60"
              alt={serviceName}
              style={{ margin: '0 auto 20px', display: 'block' }}
            />
          )}
          <Text style={paragraph}>안녕하세요, **{userName}**님!</Text>
          <Text style={paragraph}>
            **{serviceName}**에 오신 것을 진심으로 환영합니다.
          </Text>
          <Text style={paragraph}>
            ✨ 당신의 별이 이제 고민을 주고받는 여정을 시작합니다.
          </Text>

          <Section style={{ textAlign: 'center', margin: '20px 0' }}>
            <Img
              src={starIconUrl}
              width="200"
              height="200"
              alt="Your Star"
              style={{ margin: '0 auto', display: 'block' }}
            />
            <Text style={{ ...paragraph, fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>
              당신의 별이 빛나기 시작했어요!
            </Text>
          </Section>

          <Text style={paragraph}>
            이곳에서 당신은 익명으로 자신의 고민을 편지에 담아 다른 별들에게 보낼 수 있습니다.
            또한, 당신의 별에 도착한 다른 이들의 고민 편지를 읽고 따뜻한 해결사가 되어줄 수도 있습니다.
          </Text>
          <Text style={paragraph}>
            특정 관심사를 가진 사람들과 소통하고 싶다면, 다양한 **채널**에 참여하여 같은 고민을 나누는 것도 가능해요.
          </Text>
          <Text style={paragraph}>
            이제, 당신의 첫 번째 여정을 시작해볼까요?
          </Text>

          <Button style={button} href={appDashboardUrl}>
            서비스 시작하기
          </Button>
        </Section>
        <hr style={hr} />
        <Section style={box}>
          <Text style={footer}>
            이 이메일은 {serviceName}에서 보낸 자동 발신 이메일입니다.
            <br />
            <Link href="#" style={link}>
              수신 거부
            </Link> | <Link href="#" style={link}>도움말</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;
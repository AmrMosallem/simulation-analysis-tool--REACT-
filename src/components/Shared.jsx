
import { Button, Text, } from '@chakra-ui/react';
import GlowingBorder from '@/components/GlowingBorder';

export function FancyButton({ content, onClick, ...rest }) {
    return (
        <Button variant={"plain"} size={'2xl'} onClick={onClick} {...rest}
            zIndex={1} borderRadius={'full'}
            position={'relative'}
            color={'white'}
            transition={"all 0.3s ease-in-out"}
            _before={{
                content: "''",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "99%",
                height: "99%",
                zIndex: -1,
                background: "var(--darker)",
                borderRadius: "full",
                transition: "all 0.2s ease-in-out",
            }}
            _hover={{
                _before: {
                    background: "var(--dark)",
                },
                transform: "scale(1.1)",
            }}
            alignSelf={"center"}
        >
            <Text textStyle={'xl'} fontWeight={'semibold'}>{content}</Text>
            <GlowingBorder firstColor={'var(--primary)'} secondColor={'var(--secondary)'} blurRadius={14} size={1} />
        </Button>)
}
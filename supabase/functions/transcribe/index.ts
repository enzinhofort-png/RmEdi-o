import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { clipId, videoUrl } = await req.json()

        // 1. Simulação de Transcrição (Whisper integra-se aqui)
        // Em produção, você faria um fetch para a API da OpenAI com o áudio do videoUrl
        console.log(`Iniciando transcrição para clipe ${clipId} do vídeo ${videoUrl}`)

        // Mock de texto gerado
        const mockTranscription = "Este é um momento incrível capturado pelo Rm_Edição! 🎬✨"

        // 2. Atualiza o clipe no banco
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { error: updateError } = await supabaseClient
            .from('clips')
            .update({
                caption_text: mockTranscription,
                has_captions: true
            })
            .eq('id', clipId)

        if (updateError) throw updateError

        return new Response(
            JSON.stringify({ success: true, text: mockTranscription }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})

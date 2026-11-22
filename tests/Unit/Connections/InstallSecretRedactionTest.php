<?php

declare(strict_types=1);

namespace Tests\Unit\Connections;

use App\Connections\Logging\InstallSecretRedaction;
use DateTimeImmutable;
use Illuminate\Support\Facades\Log;
use Monolog\Level;
use Monolog\Logger;
use Monolog\LogRecord;
use Tests\TestCase;

/**
 * No log record keeps an install line's ticket or a relay's credential: the ticket segment of an install path and
 * the secret fields of a redeem body are redacted, every other field kept.
 */
final class InstallSecretRedactionTest extends TestCase
{
    private const string REDACTED_MESSAGE = 'GET /install/[redacted] failed';

    private const string TICKET = 'Q2hhbmdlIHRoaXMgdGlja2V0IG5vdyBwbGVhc2UgMTIzNDU2';

    public function test_a_ticket_in_a_path_and_the_secret_fields_of_a_body_are_redacted(): void
    {
        $record = new LogRecord(
            new DateTimeImmutable(),
            'local',
            Level::Error,
            'GET /install/'.self::TICKET.' failed',
            ['request' => ['ticket' => self::TICKET, 'hostCredential' => 'secret', 'canonicalRoot' => '/work/shop'],
                'url' => 'https://journal.example.com/install/'.self::TICKET],
        );

        $redacted = (new InstallSecretRedaction())($record);

        $written = $redacted->message.json_encode($redacted->context);
        $this->assertStringNotContainsString(self::TICKET, $written);
        $this->assertStringNotContainsString('secret', $written);
        $this->assertSame('/work/shop', $redacted->context['request']['canonicalRoot']);
        $this->assertSame(self::REDACTED_MESSAGE, $redacted->message);
    }

    public function test_every_log_channel_redacts(): void
    {
        $logger = Log::channel('single')->getLogger();

        $this->assertInstanceOf(Logger::class, $logger);
        $this->assertNotEmpty(
            array_filter($logger->getProcessors(), fn ($processor) => $processor instanceof InstallSecretRedaction),
        );
    }
}

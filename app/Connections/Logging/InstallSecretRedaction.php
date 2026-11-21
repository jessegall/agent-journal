<?php

declare(strict_types=1);

namespace App\Connections\Logging;

use Monolog\LogRecord;
use Monolog\Processor\ProcessorInterface;

/**
 * Keeps an install line's ticket and a relay's credential out of every log record: the ticket segment of an
 * /install/{ticket} path is replaced wherever a message or context names it, and the ticket, credential and nonce
 * fields of a redeem or recover body are replaced by name.
 */
final class InstallSecretRedaction implements ProcessorInterface
{
    private const string REDACTED = '[redacted]';

    /**
     * The fields of the connection routes' bodies that hold a secret.
     */
    private const array SECRET_FIELDS = ['ticket', 'hostCredential', 'installationNonce', 'deviceCode', 'grant'];

    private const string INSTALL_PATH = '#/install/[A-Za-z0-9_-]+#';

    public function __invoke(LogRecord $record): LogRecord
    {
        return $record->with(
            message: $this->redactText($record->message),
            context: $this->redactFields($record->context),
            extra: $this->redactFields($record->extra),
        );
    }

    private function redactText(string $text): string
    {
        return (string) preg_replace(self::INSTALL_PATH, '/install/'.self::REDACTED, $text);
    }

    /**
     * @param  array<mixed>  $fields
     * @return array<mixed>
     */
    private function redactFields(array $fields): array
    {
        $redacted = [];

        foreach ($fields as $name => $value) {
            $redacted[$name] = match (true) {
                in_array($name, self::SECRET_FIELDS, true) => self::REDACTED,
                is_array($value) => $this->redactFields($value),
                is_string($value) => $this->redactText($value),
                default => $value,
            };
        }

        return $redacted;
    }
}

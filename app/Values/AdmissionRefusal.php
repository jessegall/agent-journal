<?php

declare(strict_types=1);

namespace App\Values;

use App\CommandRules\Enums\AdmissionRefusalCode;

/**
 * Why a line was refused, at which node and source text, how to correct it, and the command request that holds the
 * work when one does; nothing of the line started. Secrets in assignments and addresses are never shown.
 */
final readonly class AdmissionRefusal
{
    private const int EXCERPT_LENGTH = 200;

    private function __construct(
        public AdmissionRefusalCode $code,
        public int $node,
        public string $excerpt,
        public AgentText $reason,
        public AgentText $correction,
        public string $requestId,
        public string $next,
    ) {}

    public static function of(
        AdmissionRefusalCode $code,
        int $node,
        string $source,
        AgentText $reason,
        AgentText $correction,
    ): self {
        return new self($code, $node, self::redacted($source), $reason, $correction, '', '');
    }

    /**
     * This refusal with the command request that now holds the work and its next allowed step.
     *
     * The refusal as an agent reads it: what was refused and why, how to correct it, and the request that holds the
     * work with its next step.
     */
    public function message(): AgentText
    {
        $values = [
            'code' => $this->code->value,
            'reason' => $this->reason,
            'notice' => AgentText::of('core.shell.nothing_started'),
            'correction' => $this->correction,
        ];

        if ($this->requestId === '') {
            return AgentText::of('core.shell.refused', $values);
        }

        $held = [...$values, 'request' => $this->requestId, 'next' => $this->next];

        return AgentText::of('core.shell.refused_held', $held);
    }

    public function heldIn(string $requestId, string $next): self
    {
        return clone ($this, ['requestId' => $requestId, 'next' => $next]);
    }

    private static function redacted(string $source): string
    {
        $text = (string) preg_replace('/\b([A-Za-z_][A-Za-z0-9_]*=)[^\s;&|]+/', '$1***', $source);
        $text = (string) preg_replace('#://[^/\s:@]+:[^/\s@]+@#', '://***@', $text);
        $escaped = addcslashes($text, "\0..\37\177");

        if (strlen($escaped) > self::EXCERPT_LENGTH) {
            return substr($escaped, 0, self::EXCERPT_LENGTH).'...';
        }

        return $escaped;
    }
}

<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Scripts\Enums\DiagnosticCode;
use App\Scripts\Exceptions\ScriptSyntaxError;

final readonly class ScriptLine
{
    private function __construct(
        public string $token,
        public string $operand,
        public ScriptRange $source,
        public ScriptRange $operandSource,
    ) {}

    public static function read(string $line, int $number): self
    {
        $body = ltrim($line);
        $column = mb_strlen($line) - mb_strlen($body) + 1;
        $parts = preg_split('/\h+/u', rtrim($body), 2, PREG_SPLIT_OFFSET_CAPTURE);

        if ($parts === false) {
            throw ScriptSyntaxError::at(
                DiagnosticCode::InvalidForm,
                new ScriptRange($number, $column, 1),
                'Expected UTF-8.',
            );
        }

        $token = $parts[0][0];
        [$operand, $offset] = $parts[1] ?? ['', strlen($token)];

        return new self(
            $token,
            $operand,
            new ScriptRange($number, $column, mb_strlen($token)),
            new ScriptRange($number, $column + mb_strlen(substr($body, 0, $offset)), mb_strlen($operand)),
        );
    }

    public function isBlank(): bool
    {
        return $this->token === '' || str_starts_with($this->token, '#');
    }
}

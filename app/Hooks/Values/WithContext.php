<?php

declare(strict_types=1);

namespace App\Hooks\Values;

/**
 * Adds ordered context and marks individual contributions for attention.
 */
trait WithContext
{
    public function withContext(string $text): self
    {
        return clone ($this, ['context' => [...$this->context, $text]]);
    }

    public function withMessage(string $text): self
    {
        return clone ($this, [
            'context' => [...$this->context, $text],
            'messages' => [...$this->messages, $text],
        ]);
    }
}

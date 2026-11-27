<?php

declare(strict_types=1);

namespace Tests\Support\Hosts\Steps;

use Tests\Support\Hosts\Steps\Contracts\HostStep;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner types the code the named sign-in's challenge asked for, under the submission key.
 */
final readonly class TypesCode implements HostStep
{
    private function __construct(private string $name, private string $code, private string $submissionKey) {}

    public static function of(string $name, string $code, string $submissionKey): self
    {
        return new self($name, $code, $submissionKey);
    }

    public function __invoke(TestJournal $journal): void
    {
        $journal->submitSignInCode($this->name, $this->code, $this->submissionKey);
    }
}

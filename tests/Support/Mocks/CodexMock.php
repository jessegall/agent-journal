<?php

declare(strict_types=1);

namespace Tests\Support\Mocks;

use Tests\Support\Mocks\Exceptions\MockRefused;

/**
 * The script of Codex's app-server on the test host: the lines the journal writes to it, in order, each answered from
 * the recordings of the build, such as CodexMock::from('codex/0.172.0')->expects('initialize', ...).
 */
final class CodexMock extends Mock
{
    public static function from(string $build): self
    {
        [$driver, $version] = explode('/', $build, 2) + [1 => ''];

        if ($driver !== 'codex' || $version === '') {
            throw MockRefused::otherDriver($build, 'codex');
        }

        return new self($driver, $version);
    }

    public function scriptName(): string
    {
        return 'codex-app-server.json';
    }

    public function program(): string
    {
        return 'codex app-server';
    }

    protected function opening(): string
    {
        return '';
    }

    protected function endsAfterEach(): bool
    {
        return false;
    }
}

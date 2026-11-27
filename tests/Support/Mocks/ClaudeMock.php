<?php

declare(strict_types=1);

namespace Tests\Support\Mocks;

use Closure;
use Tests\Support\Mocks\Exceptions\MockRefused;

/**
 * The script of Claude Code's sign-in on the test host: it shows the recorded sign-in address, hears the code the
 * owner typed and answers it from the recordings of the build, then ends as the real login does.
 */
final class ClaudeMock extends Mock
{
    public static function from(string $build): self
    {
        [$driver, $version] = explode('/', $build, 2) + [1 => ''];

        if ($driver !== 'claude-code' || $version === '') {
            throw MockRefused::otherDriver($build, 'claude-code');
        }

        return new self($driver, $version);
    }

    /**
     * The next line the login hears is the code the owner typed, and the scope says what it answers.
     *
     * @param  Closure(Answer): mixed  $answer
     */
    public function expectsCode(Closure $answer): self
    {
        return $this->expects('', $answer);
    }

    public function scriptName(): string
    {
        return 'claude-login.json';
    }

    public function program(): string
    {
        return 'claude auth login';
    }

    protected function opening(): string
    {
        return 'login-with-code';
    }

    protected function endsAfterLast(): bool
    {
        return true;
    }
}

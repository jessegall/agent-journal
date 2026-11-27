<?php

declare(strict_types=1);

namespace App\Recordings;

/**
 * Puts fake values in place of the real ones that went into or came out of a recorded exchange, on any wire, so a
 * recording keeps nothing of the machine and the account it was made with: each folder its environment names becomes
 * {env:NAME} for the mock to fill, and addresses, tokens, account ids, names, the user's folders and every uuid become
 * fakes. One uuid is the same fake throughout a recording, so a replay still pairs what it hears with what it answers.
 */
final class RecordingFakes
{
    public const string EMAIL = 'user@example.com';

    public const string TOKEN = 'fake-token';

    public const string JSON_WEB_TOKEN = 'eyJmYWtlIjoidG9rZW4ifQ.ZmFrZQ.ZmFrZQ';

    public const string ORGANIZATION = 'Example Organization';

    public const string USER_NAME = 'Example User';

    public const string USER_FOLDER = '/home/user';

    /**
     * The shortest folder of the environment put back as {env:NAME}, so a short value such as / is never.
     */
    private const int SHORTEST_FOLDER = 4;

    /**
     * The start of every fake uuid, which is kept as it is, so a recording made from a mock's answer stays the same.
     */
    private const string FAKE_UUID_PREFIX = '00000000-0000-4000-8000-';

    private const string UUID = '/\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/';

    private const string ACCOUNT_ID = '/\b(user|org|acct|account)-[A-Za-z0-9]{12,}\b/';

    /**
     * The real value of each uuid and account id seen, by its fake.
     *
     * @var array<string, string>
     */
    private array $fakes = [];

    /**
     * @param  array<string, string>  $environment  the recorded process's variables, by name
     */
    public function __construct(private readonly array $environment) {}

    public function replaceIn(string $text): string
    {
        $faked = strtr($text, $this->environmentFolders());

        $faked = (string) preg_replace(
            [
                '#/(?:Users|home)/(?!user\b)[^/\s"\'\\\\]+#',
                '#\\\\/(?:Users|home)\\\\/(?!user\b)[^/\s"\'\\\\]+#',
                '#-(?:Users|home)-(?!user-)[A-Za-z0-9._]+-#',
            ],
            [self::USER_FOLDER, str_replace('/', '\\/', self::USER_FOLDER), '-home-user-'],
            $faked,
        );

        $faked = (string) preg_replace('/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/', self::EMAIL, $faked);

        $faked = (string) preg_replace(
            ['/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/', '/\bsk-(?:ant-)?[A-Za-z0-9_-]{16,}/'],
            [self::JSON_WEB_TOKEN, 'sk-'.self::TOKEN],
            $faked,
        );

        $faked = $this->replaceNamedValues($faked);

        $faked = (string) preg_replace_callback(
            self::ACCOUNT_ID,
            fn (array $found) => $this->fakeOf($found[0], $found[1]),
            $faked,
        );

        return (string) preg_replace_callback(self::UUID, fn (array $found) => $this->fakeOf($found[0], ''), $faked);
    }

    /**
     * Each folder the environment names, by its path as printed and as JSON escapes it, put back as the variable that
     * names it; strtr replaces the longest path first.
     *
     * @return array<string, string>
     */
    private function environmentFolders(): array
    {
        $folders = array_filter(
            $this->environment,
            fn (string $value) => str_starts_with($value, '/') && strlen($value) >= self::SHORTEST_FOLDER
                && ! str_contains($value, ':'),
        );

        $named = array_map(fn (string $name) => "{env:{$name}}", array_flip($folders));

        $escaped = array_combine(
            array_map(fn (string $folder) => str_replace('/', '\\/', $folder), array_keys($named)),
            $named,
        );

        return [
            ...$named,
            ...$escaped,
        ];
    }

    /**
     * The tokens, names and organizations a program prints under their JSON keys, and an organization a screen names.
     */
    private function replaceNamedValues(string $text): string
    {
        $named = (string) preg_replace(
            '/("(?:access_?token|refresh_?token|id_?token|api_?key|accessToken|refreshToken|idToken|apiKey|token)'
                .'\\\\?"\s*:\s*\\\\?")[^"\\\\]+/i',
            '${1}'.self::TOKEN,
            $text,
        );

        $named = (string) preg_replace(
            '/("(?:orgName|organizationName|organization_name)\\\\?"\s*:\s*\\\\?")[^"\\\\]+/',
            '${1}'.self::ORGANIZATION,
            $named,
        );

        $named = (string) preg_replace(
            '/("(?:displayName|fullName|userName|display_name|full_name)\\\\?"\s*:\s*\\\\?")[^"\\\\]+/',
            '${1}'.self::USER_NAME,
            $named,
        );

        return (string) preg_replace("/[^\\s\"'│]+(?:'s|’s) (Organization|Workspace)/u", 'Example\'s $1', $named);
    }

    /**
     * The fake a real uuid or account id gets, the same each time it is seen.
     */
    private function fakeOf(string $real, string $prefix): string
    {
        if (str_starts_with($real, self::FAKE_UUID_PREFIX)) {
            return $real;
        }

        $known = array_search($real, $this->fakes, true);

        if (is_string($known)) {
            return $known;
        }

        $number = count($this->fakes) + 1;

        $fake = $prefix === ''
            ? sprintf('%s%012d', self::FAKE_UUID_PREFIX, $number)
            : sprintf('%s-%016d', $prefix, $number);

        $this->fakes[$fake] = $real;

        return $fake;
    }
}

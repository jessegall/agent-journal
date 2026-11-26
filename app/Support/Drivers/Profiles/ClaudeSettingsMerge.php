<?php

declare(strict_types=1);

namespace App\Support\Drivers\Profiles;

use App\Attributes\Rules\DecodesAnyJson;
use App\Exceptions\ProfileRefused;

/**
 * A start's Claude Code settings with an account's checked protection settings added: permission lists are joined,
 * and any other setting is added where the start has none; a setting both name differently refuses the start, as one
 * side would lose.
 */
final readonly class ClaudeSettingsMerge
{
    /**
     * @param  array<string, mixed>  $settings
     */
    public function __construct(private array $settings) {}

    /**
     * The start's settings with the account's protection settings, a settings document of the driver's own of any
     * shape, added where they do not replace one of the start's.
     *
     * @return array<string, mixed>
     *
     * @throws ProfileRefused
     */
    #[DecodesAnyJson]
    public function withProtection(string $protection): array
    {
        $account = json_decode($protection, true, flags: JSON_THROW_ON_ERROR);
        $settings = $this->settings;

        if (array_key_exists('permissions', $account)) {
            foreach ($account['permissions'] as $name => $value) {
                $own = $settings['permissions'];

                $settings['permissions'] = is_array($value) && array_is_list($value)
                    ? [
                        ...$own,
                        $name => self::joined($own[$name] ?? [], $value),
                    ]
                    : self::added($own, "permissions.{$name}", $name, $value);
            }
        }

        unset($account['permissions']);

        foreach ($account as $name => $value) {
            $settings = self::added($settings, $name, $name, $value);
        }

        return $settings;
    }

    /**
     * @param  array<string, mixed>  $settings
     * @return array<string, mixed>
     */
    private static function added(array $settings, string $path, string $name, mixed $value): array
    {
        if (array_key_exists($name, $settings) && $settings[$name] !== $value) {
            throw ProfileRefused::settingReplaced($path);
        }

        return [
            ...$settings,
            $name => $value,
        ];
    }

    /**
     * The start's rules followed by each account rule it does not have yet.
     *
     * @param  list<string>  $own
     * @param  list<mixed>  $account
     * @return list<string>
     */
    private static function joined(array $own, array $account): array
    {
        $rules = array_map(strval(...), $account);

        return array_values(array_unique([
            ...$own,
            ...$rules,
        ]));
    }
}

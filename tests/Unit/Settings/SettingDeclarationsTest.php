<?php

declare(strict_types=1);

namespace Tests\Unit\Settings;

use App\Settings\Declarations\SettingGroup;
use App\Settings\Declarations\StringSetting;
use App\Settings\Enums\SettingType;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Support\SettingKey;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * A text setting and a group check their own declaration and refuse a wrong one naming the key, never the value.
 */
final class SettingDeclarationsTest extends TestCase
{
    public function test_a_valid_text_setting_and_group_are_built(): void
    {
        $setting = StringSetting::make('display_name', 'Journal name', 'Journal', 1, 200);
        $group = SettingGroup::make('general', 'General', [$setting]);

        $this->assertSame(SettingType::String, $setting->type());
        $this->assertSame([$setting], $group->settings());
        $this->assertTrue($setting->accepts('Mine'));
        $this->assertFalse($setting->accepts(''));
        $this->assertFalse($setting->accepts(str_repeat('a', $setting->maximumLength + 1)));
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function badKeys(): iterable
    {
        yield 'uppercase' => ['Display'];
        yield 'a dot' => ['display.name'];
        yield 'a colon' => ['display:name'];
        yield 'over the key length' => [str_repeat('a', SettingKey::KEY_CHARACTERS + 1)];
    }

    #[DataProvider('badKeys')]
    public function test_a_bad_key_is_refused_by_name(string $key): void
    {
        $this->expectException(SettingDeclarationInvalid::class);
        $this->expectExceptionMessage($key);

        StringSetting::make($key, 'Label', 'value');
    }

    public function test_a_group_with_a_bad_key_is_refused(): void
    {
        $this->expectException(SettingDeclarationInvalid::class);

        SettingGroup::make('General', 'General', []);
    }

    public function test_an_empty_label_is_refused(): void
    {
        $this->expectException(SettingDeclarationInvalid::class);
        $this->expectExceptionMessage('display_name');

        StringSetting::make('display_name', ' ', 'Journal');
    }

    public function test_a_label_over_the_label_length_is_refused(): void
    {
        $this->expectException(SettingDeclarationInvalid::class);

        StringSetting::make('display_name', str_repeat('é', SettingKey::LABEL_CHARACTERS + 1), 'Journal');
    }

    public function test_a_default_outside_the_lengths_is_refused_without_the_value(): void
    {
        try {
            StringSetting::make('display_name', 'Journal name', 'Secret default', maximumLength: 4);
            $this->fail('The long default was accepted.');
        } catch (SettingDeclarationInvalid $refusal) {
            $this->assertStringContainsString('display_name', $refusal->getMessage());
            $this->assertStringNotContainsString('Secret default', $refusal->getMessage());
        }
    }

    public function test_lengths_above_the_longest_text_are_refused(): void
    {
        $this->expectException(SettingDeclarationInvalid::class);

        StringSetting::make('notes', 'Notes', '', maximumLength: StringSetting::LONGEST + 1);
    }
}

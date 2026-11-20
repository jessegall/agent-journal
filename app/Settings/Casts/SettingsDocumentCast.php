<?php

declare(strict_types=1);

namespace App\Settings\Casts;

use App\Settings\Exceptions\SettingsDocumentInvalid;
use App\Settings\Storage\EncodedSetting;
use App\Settings\Storage\EncodedToggle;
use App\Settings\Storage\EncodedValue;
use App\Settings\Storage\SettingsDocument;
use App\Settings\Support\SettingKey;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use JsonException;
use stdClass;

/**
 * Reads the JSON document column as a SettingsDocument, checking only its structure: the envelope, the shape and key
 * of each entry, unique keys within a list and the size. Whether a value suits its setting is left to the reader.
 *
 * @implements CastsAttributes<SettingsDocument, SettingsDocument>
 */
final class SettingsDocumentCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     *
     * @throws SettingsDocumentInvalid
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): SettingsDocument
    {
        $owner = (string) $attributes['owner'];

        if (! is_string($value)) {
            throw SettingsDocumentInvalid::wrongEnvelope($owner);
        }

        $this->assertSizeWithinLimit($owner, $value);

        try {
            $envelope = json_decode($value, false, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $cause) {
            throw SettingsDocumentInvalid::notJson($owner, previous: $cause);
        }

        if (! $this->isEnvelope($envelope)) {
            throw SettingsDocumentInvalid::wrongEnvelope($owner);
        }

        return new SettingsDocument(
            array_map(
                fn (array $entry) => new EncodedSetting($entry['key'], $entry['value']),
                $this->entries($owner, 'settings', $envelope->settings),
            ),
            array_map(
                fn (array $entry) => new EncodedToggle($entry['key'], $entry['value']),
                $this->entries($owner, 'toggles', $envelope->toggles),
            ),
        );
    }

    /**
     * @param  SettingsDocument  $value
     * @param  array<string, mixed>  $attributes
     * @return array<string, string>
     *
     * @throws SettingsDocumentInvalid
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        $json = $value->toJson();
        $this->assertSizeWithinLimit((string) $attributes['owner'], $json);

        return [$key => $json];
    }

    /**
     * @throws SettingsDocumentInvalid
     */
    private function assertSizeWithinLimit(string $owner, string $json): void
    {
        if (strlen($json) > SettingsDocument::MOST_BYTES) {
            throw SettingsDocumentInvalid::tooLarge($owner, strlen($json), SettingsDocument::MOST_BYTES);
        }
    }

    /**
     * Whether the object has these properties and no other, in any order.
     *
     * @param  list<string>  $names  sorted
     */
    private function holdsExactly(stdClass $object, array $names): bool
    {
        $properties = array_map(strval(...), array_keys(get_object_vars($object)));
        sort($properties);

        return $properties === $names;
    }

    /**
     * The entries of one list by key, each as its key and its encoded value.
     *
     * @param  list<mixed>  $rows
     * @return array<string, array{key: string, value: EncodedValue}>
     *
     * @throws SettingsDocumentInvalid
     */
    private function entries(string $owner, string $listName, array $rows): array
    {
        $settingsByKey = [];

        foreach ($rows as $position => $entry) {
            if (! $entry instanceof stdClass
                || ! $this->holdsExactly($entry, ['key', 'value'])
                || ! is_string($entry->key)
                || ! SettingKey::isValidKey($entry->key)) {
                throw SettingsDocumentInvalid::malformedEntry($owner, $listName, $position);
            }

            if (array_key_exists($entry->key, $settingsByKey)) {
                throw SettingsDocumentInvalid::duplicateKey($owner, $listName, $position);
            }

            $settingsByKey[$entry->key] = ['key' => $entry->key, 'value' => EncodedValue::of($entry->value)];
        }

        return $settingsByKey;
    }

    /**
     * Whether a decoded value is the document's envelope: an object holding exactly a settings list and a toggles list.
     *
     * @phpstan-assert-if-true stdClass&object{settings: list<mixed>, toggles: list<mixed>} $envelope
     */
    private function isEnvelope(mixed $envelope): bool
    {
        return $envelope instanceof stdClass
            && $this->holdsExactly($envelope, ['settings', 'toggles'])
            && is_array($envelope->settings) && array_is_list($envelope->settings)
            && is_array($envelope->toggles) && array_is_list($envelope->toggles);
    }
}

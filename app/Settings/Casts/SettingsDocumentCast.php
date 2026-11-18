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

        $this->requireSize($owner, $value);

        try {
            $envelope = json_decode($value, false, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            throw SettingsDocumentInvalid::notJson($owner);
        }

        if (! $envelope instanceof stdClass || ! $this->holdsExactly($envelope, ['settings', 'toggles']) || ! is_array($envelope->settings) || ! is_array($envelope->toggles)) {
            throw SettingsDocumentInvalid::wrongEnvelope($owner);
        }

        return new SettingsDocument(
            array_map(fn (array $entry) => new EncodedSetting(...$entry), $this->entries($owner, 'settings', $envelope->settings)),
            array_map(fn (array $entry) => new EncodedToggle(...$entry), $this->entries($owner, 'toggles', $envelope->toggles)),
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
        $this->requireSize((string) $attributes['owner'], $json);

        return [$key => $json];
    }

    /**
     * @throws SettingsDocumentInvalid
     */
    private function requireSize(string $owner, string $json): void
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
     * @param  list<mixed>  $list
     * @return array<string, array{key: string, value: EncodedValue}>
     *
     * @throws SettingsDocumentInvalid
     */
    private function entries(string $owner, string $listName, array $list): array
    {
        $entries = [];

        foreach ($list as $position => $entry) {
            if (! $entry instanceof stdClass || ! $this->holdsExactly($entry, ['key', 'value']) || ! is_string($entry->key) || ! SettingKey::isValidKey($entry->key)) {
                throw SettingsDocumentInvalid::malformedEntry($owner, $listName, $position);
            }

            if (array_key_exists($entry->key, $entries)) {
                throw SettingsDocumentInvalid::duplicateKey($owner, $listName, $position);
            }

            $entries[$entry->key] = ['key' => $entry->key, 'value' => EncodedValue::of($entry->value)];
        }

        return $entries;
    }
}

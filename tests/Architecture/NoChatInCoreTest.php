<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;

/**
 * Nothing in core's backend names chat: no file, class, method, comment or string of app holds the word. Chat is the
 * picture of inboxes and lives in the chat domain alone. The product name ChatGPT is not the word.
 */
final class NoChatInCoreTest extends TestCase
{
    private const string CHAT = '/chat(?!gpt)/i';

    public function test_no_core_file_names_chat(): void
    {
        $faults = [];

        foreach (DomainFiles::in([app_path()]) as $file) {
            $relative = str_replace(base_path().'/', '', $file);

            if (preg_match(self::CHAT, $relative) === 1) {
                $faults[] = $relative;
            }

            foreach (file($file) ?: [] as $index => $line) {
                if (preg_match(self::CHAT, $line) === 1) {
                    $faults[] = $relative.':'.($index + 1).' '.trim($line);
                }
            }
        }

        $this->assertSame([], $faults, 'Move these into domain/Chat or name what they are.');
    }
}

<?php

declare(strict_types=1);

/**
 * The naming rules (rule 99, user message 21116), judged from the grammar of each name with the code's own verbs, so no
 * list of names is kept: a thing is a noun for what it is, an action starts with its verb, an event says what happened
 * and a yes-or-no answer reads as a question. docs/naming/forbidden-words.txt adds the words no name may hold and the
 * verbs that have a better word.
 */

require_once __DIR__.'/name-word-splitting.php';

/**
 * The folders whose classes are actions, named with their verb first: steps, pipelines, commands, listeners and jobs.
 * A console command is named subject first, as it is typed (ReportMakeCommand for report make).
 */
const ACTION_FOLDERS = '#/(Pipes|Pipelines|(?<!Console/)Commands|Listeners|Jobs)/#';

/**
 * The words that open a yes-or-no question.
 */
const QUESTION_WORDS = ['is', 'has', 'have', 'can', 'should', 'must', 'may', 'does', 'was', 'were', 'will', 'needs'];

/**
 * The endings of a past form, which an event's last word has: requested, written, sent, held, begun.
 */
const PAST_FORM = '/(ed|en|wn|ne|ung|un|ound|ought|aught|ent|ept|eft|eld|old|ost|ade|aid|ead|ut|et|it|uck|ook|ew|ame)$/';

/**
 * The verbs of the code, learned from its actions: those a command method or function starts with, and with
 * $withActionClasses also those an action class starts with. A test's helpers are left out, since a test may name a
 * step for its subject.
 *
 * @param  list<DeclaredName>  $names
 * @return array<string, true>
 */
function verbsOf(array $names, bool $withActionClasses): array
{
    $verbs = [];

    foreach ($names as $declared) {
        $isTest = preg_match('#Test\.php|_test\.go|tests/Support/#', $declared->place) === 1;
        $isCommand = $declared->role === 'action' && in_array($declared->declarationType, ['method', 'function'], true)
            && ! str_contains($declared->place, '.sh');
        $isActionClass = $withActionClasses && $declared->role === 'action' && $declared->declarationType === 'class';

        if (! $isTest && ($isCommand || $isActionClass)) {
            $verbs[firstWordOf($declared->name)] = true;
        }
    }

    unset($verbs['']);

    return [...$verbs, ...inflectedVerbsOf($names)];
}

/**
 * The words the code also uses inflected as verbs are (trusted, building), so a verb no command starts with yet is
 * still known: a word is a verb when a name holds it with -ed or -ing.
 *
 * @param  list<DeclaredName>  $names
 * @return array<string, true>
 */
function inflectedVerbsOf(array $names): array
{
    $verbs = [];

    foreach ($names as $declared) {
        foreach (wordsOf($declared->name) as $word) {
            if (preg_match('/^(\w{2,}?)(e?d|ing)$/', $word, $match) === 1) {
                $verbs[$match[1]] = true;
                $verbs[$match[1].'e'] = true;
                // A doubled last consonant is the spelling of the inflection: pinned, scanning.
                $verbs[(string) preg_replace('/([b-df-hj-np-tv-z])\1$/', '$1', $match[1])] = true;
            }
        }
    }

    return $verbs;
}

/**
 * Each name that breaks a naming rule, as "type name (place): why".
 *
 * @param  list<DeclaredName>  $names
 * @return list<string>
 */
function nameFaults(array $names, string $forbiddenWordsFile): array
{
    $forbidden = forbiddenWords($forbiddenWordsFile);
    $betterVerbs = betterVerbs($forbiddenWordsFile);
    $verbs = verbsOf($names, withActionClasses: true);
    $commandVerbs = verbsOf($names, withActionClasses: false);
    $nouns = nounsOf($names);
    $faults = [];

    foreach ($names as $declared) {
        $reasons = array_filter([
            forbiddenWordFault($declared, $forbidden),
            betterVerbFault($declared, $betterVerbs),
            purposeFault($declared, $verbs),
            actionClassFault($declared, $commandVerbs, $nouns),
            eventFault($declared),
            commandMoodFault($declared, $verbs),
            questionFault($declared, $verbs),
            getterFault($declared),
            shellFunctionFault($declared, $verbs, $nouns),
        ]);

        foreach ($reasons as $reason) {
            $faults[] = "{$declared->declarationType} {$declared->name} ({$declared->place}): {$reason}";
        }
    }

    return array_values(array_unique($faults));
}

/**
 * @param  array<string, string>  $forbidden
 */
function forbiddenWordFault(DeclaredName $declared, array $forbidden): ?string
{
    if ($declared->role === 'override') {
        return null;
    }

    $words = array_values(array_unique(array_filter(wordsOf($declared->name), fn (string $word) => isset($forbidden[$word]))));

    return $words === [] ? null : 'holds the forbidden '.implode(', ', array_map(fn (string $word) => $forbidden[$word], $words));
}

/**
 * An action's verb that has a better coding word: report says notify.
 *
 * @param  array<string, string>  $betterVerbs
 */
function betterVerbFault(DeclaredName $declared, array $betterVerbs): ?string
{
    $first = firstWordOf($declared->name);
    $isAction = $declared->role === 'action' || $declared->declarationType === 'function';

    return $isAction && isset($betterVerbs[$first]) ? "its verb {$first}: {$betterVerbs[$first]}" : null;
}

/**
 * A thing named for what will be done with it ("step to run") instead of for what it is. An action or a question may
 * hold "to" and a verb, so may a function that starts with its own verb, and a participle before "to" names a state
 * (failed to start).
 *
 * @param  array<string, true>  $verbs
 */
function purposeFault(DeclaredName $declared, array $verbs): ?string
{
    $words = wordsOf($declared->name);
    $first = $words[0] ?? '';
    $isFunction = in_array($declared->declarationType, ['method', 'function'], true);

    if ($declared->role !== 'thing' || in_array($first, QUESTION_WORDS, true) || ($isFunction && isset($verbs[$first]))) {
        return null;
    }

    foreach ($words as $at => $word) {
        $isState = $at > 0 && preg_match('/(ed|ing)$/', $words[$at - 1]) === 1;

        if ($word === 'to' && $at > 0 && ! $isState && isset($words[$at + 1], $verbs[$words[$at + 1]])) {
            return "named for what will be done with it ({$words[$at - 1]} to {$words[$at + 1]}): name what it is, "
                .'a pending, active or waiting one, or its plain noun';
        }
    }

    return null;
}

/**
 * An action class (a step, pipeline, command, listener or job) starts with the verb of what it does, not with a noun
 * the code names a type for (ChatActivityRecorder is RecordChatActivity).
 *
 * @param  array<string, true>  $commandVerbs
 * @param  array<string, true>  $nouns
 */
function actionClassFault(DeclaredName $declared, array $commandVerbs, array $nouns): ?string
{
    $first = firstWordOf($declared->name);
    $isNoun = ! isset($commandVerbs[$first]) && (isset($nouns[$first]) || isset($nouns[rtrim($first, 's')]));

    if ($declared->declarationType !== 'class' || $declared->role !== 'action' || ! $isNoun) {
        return null;
    }

    return "an action class starts with its verb, and {$first} is a noun the code names types for";
}

/**
 * The nouns of the code: the last word of every type it declares (a PendingStep makes step a noun).
 *
 * @param  list<DeclaredName>  $names
 * @return array<string, true>
 */
function nounsOf(array $names): array
{
    $nouns = [];

    foreach ($names as $declared) {
        if (in_array($declared->declarationType, ['class', 'interface', 'enum', 'trait', 'type', 'component'], true)) {
            $words = wordsOf($declared->name);
            $nouns[(string) end($words)] = true;
        }
    }

    return $nouns;
}

/**
 * An event says what happened: a word after its subject is a past form (StopRequested, AccountHeldForMaintenance).
 */
function eventFault(DeclaredName $declared): ?string
{
    $isEvent = $declared->declarationType === 'class' && preg_match('#^(app|domain/\w+/src)/(.*/)?Events/#', $declared->place) === 1;
    $saysWhatHappened = array_any(array_slice(wordsOf($declared->name), 1), fn (string $word) => preg_match(PAST_FORM, $word) === 1);

    return $isEvent && ! $saysWhatHappened ? 'an event says what happened, and no word of it is a past form' : null;
}

/**
 * A command (a method or function that returns nothing) is imperative: close, not closes.
 *
 * @param  array<string, true>  $verbs
 */
function commandMoodFault(DeclaredName $declared, array $verbs): ?string
{
    $first = firstWordOf($declared->name);
    $isCommand = $declared->role === 'action' && in_array($declared->declarationType, ['method', 'function'], true);
    $stem = in_array($first, QUESTION_WORDS, true) ? null : stemOfThirdPerson($first, $verbs);

    return $isCommand && $stem !== null ? "a command is imperative: {$stem}, not {$first}" : null;
}

/**
 * A yes-or-no answer reads as a question: is, has, can and the like first, or a verb in its third person (allows,
 * contains), which a first word ending in a single s is taken to be.
 *
 * @param  array<string, true>  $verbs
 */
function questionFault(DeclaredName $declared, array $verbs): ?string
{
    $first = firstWordOf($declared->name);

    $isThirdPerson = stemOfThirdPerson($first, $verbs) !== null || preg_match('/[^s]s$/', $first) === 1;

    if ($declared->role !== 'question' || in_array($first, QUESTION_WORDS, true) || $isThirdPerson) {
        return null;
    }

    return "a yes or no answer reads as a question (is, has, can, or a verb such as allows), and {$first} does not";
}

/**
 * A method that answers is named for its answer, never get first; a name a vendor type gives (a cast's get, an
 * iterator's getIterator) is kept, and so is get alone.
 */
function getterFault(DeclaredName $declared): ?string
{
    $words = wordsOf($declared->name);
    $isFunction = in_array($declared->declarationType, ['method', 'function'], true);

    $isOwnName = $declared->role !== 'override';

    return $isOwnName && $isFunction && count($words) > 1 && $words[0] === 'get' ? 'named for its answer, never get first' : null;
}

/**
 * A shell function is a step named verb_noun, or a question (is_archived); main is the script's entry. A first word
 * the code knows as a noun or a past form (schema_changed) and not as a verb is refused.
 *
 * @param  array<string, true>  $verbs
 * @param  array<string, true>  $nouns
 */
function shellFunctionFault(DeclaredName $declared, array $verbs, array $nouns): ?string
{
    $first = firstWordOf($declared->name);
    $isShellFunction = $declared->declarationType === 'function' && str_contains($declared->place, '.sh');
    $isVerb = isset($verbs[$first]) || in_array($first, QUESTION_WORDS, true);
    $isNoun = isset($nouns[$first]) || isset($nouns[rtrim($first, 's')]) || preg_match('/(ed|ing)$/', $first) === 1;

    if (! $isShellFunction || $declared->name === 'main' || $isVerb || ! $isNoun) {
        return null;
    }

    return "a shell function is verb_noun, and {$first} is no verb";
}

/**
 * The verb a word is the third person of (allows of allow, carries of carry), or null when it is none.
 *
 * @param  array<string, true>  $verbs
 */
function stemOfThirdPerson(string $word, array $verbs): ?string
{
    $stems = array_filter([
        str_ends_with($word, 'ies') ? substr($word, 0, -3).'y' : null,
        str_ends_with($word, 'es') ? substr($word, 0, -2) : null,
        str_ends_with($word, 's') && ! str_ends_with($word, 'ss') ? substr($word, 0, -1) : null,
    ]);

    foreach ($stems as $stem) {
        if (isset($verbs[$stem])) {
            return $stem;
        }
    }

    return null;
}

function firstWordOf(string $name): string
{
    return wordsOf($name)[0] ?? '';
}

/**
 * The forbidden words, one to a line before a tab and the reason; a line starting with # is a comment, and one starting
 * with verb: names a better word for an action's verb.
 *
 * @return array<string, string> word => the word with why it is forbidden
 */
function forbiddenWords(string $file): array
{
    $words = [];

    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        if (! str_starts_with($line, '#') && ! str_starts_with($line, 'verb:')) {
            [$word, $why] = explode("\t", $line, 2) + [1 => ''];
            $words[strtolower(trim($word))] = trim($word).($why === '' ? '' : " ({$why})");
        }
    }

    return $words;
}

/**
 * The verbs forbidden-words.txt names a better word for, on its lines that start with verb:.
 *
 * @return array<string, string> verb => why, with the better word
 */
function betterVerbs(string $file): array
{
    $verbs = [];

    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        if (str_starts_with($line, 'verb:')) {
            [$verb, $why] = explode("\t", substr($line, strlen('verb:')), 2) + [1 => ''];
            $verbs[strtolower(trim($verb))] = trim($why);
        }
    }

    return $verbs;
}

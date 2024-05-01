"use client";

import { useCallback, useEffect, useMemo } from "react";

import { socket } from "@/lib/socket";

export const useSocketConnection = () => {
	const peerConnection = useMemo(() => {
		const connection = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun2.1.google.com:19302" }],
		});

		connection.addEventListener("icecandidate", (event) => {
			socket.emit("send_candidate", {
				candidate: event.candidate,
				roomName: "experience",
			});
		});

		return connection;
	}, []);

	const handleConnection = useCallback(() => {
		socket.emit("join_room", "experience");
	}, []);

	const sendConnectionOffer = useCallback(async () => {
		console.log("new player joined");

		const offer = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(offer);

		socket.emit("send_connection_offer", {
			roomName: "experience",
			offer,
		});
	}, [peerConnection]);

	const handleConnectionOffer = useCallback(
		async (params: { offer: RTCSessionDescriptionInit }) => {
			await peerConnection.setRemoteDescription(params.offer);
			const answer = await peerConnection.createAnswer();
			await peerConnection.setLocalDescription(answer);

			socket.emit("answer", { answer, roomName: "experience" });
		},
		[peerConnection]
	);

	const handleOfferAnswer = useCallback(
		(params: { answer: RTCSessionDescriptionInit }) => {
			peerConnection.setRemoteDescription(params.answer);
		},
		[peerConnection]
	);

	const handleReceiveCandidate = useCallback(
		(params: { candidate: RTCIceCandidate }) => {
			peerConnection.addIceCandidate(params.candidate);
		},
		[peerConnection]
	);

	useEffect(() => {
		socket.connect();
		socket.on("connect", handleConnection);
		// socket.on("player_joined", sendConnectionOffer);
		socket.on("send_connection_offer", handleConnectionOffer);
		socket.on("answer", handleOfferAnswer);
		socket.on("send_candidate", handleReceiveCandidate);

		return () => {
			socket.off("connect", handleConnection);
			// socket.off("player_joined", sendConnectionOffer);
			socket.off("send_connection_offer", handleConnectionOffer);
			socket.off("answer", handleOfferAnswer);
			socket.off("send_candidate", handleReceiveCandidate);
		};
	}, [
		handleConnection,
		sendConnectionOffer,
		handleConnectionOffer,
		handleOfferAnswer,
		handleReceiveCandidate,
	]);

	return {
		peerConnection,
		socket,
	};
};
